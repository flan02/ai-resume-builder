"use server"
import { auth } from "@/auth"
import { db } from "@/db"
// import { env } from "@/env";
// import stripe from "@/lib/stripe";
//import { del, put } from "@vercel/blob";

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";

//import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";

import path from "path";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

import { revalidatePath } from "next/cache";






export async function loggedAsAdmin(email: string) {
  //console.log("loggedAsAdmin", id);
  try {
    const isAdmin = await db.user.findFirst({
      where: {
        email
      }
    })

    //console.log('isAdmin', isAdmin);
    if (!isAdmin) return null

    return isAdmin
  } catch (error) {
    console.error("We found the following error: ", error)
    return null
  }
}


export async function createUser(name: string, email: string, image: string) {

  try {
    const newUser = await db.user.create({
      data: {
        name,
        email,
        image
      }

    })
    return true
  } catch (error) {
    console.error("We found an error creating this new user: ", error)
    return { message: "We found an error creating this new user", status: 500 }
  }

}



export async function createCheckoutSession(priceId: string) {
  const session = auth()

  if (!session) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as | string | undefined;

  const sessionBilling = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!sessionBilling.url) {
    throw new Error("Failed to create checkout session");
  }

  return sessionBilling.url;
}




export async function saveResume(values: ResumeValues) {
  const { id } = values

  console.log("received values", values)

  const { photo, workExperiences, educations, ...resumeValues } = resumeSchema.parse(values) // ? parse is a method that validates the data and returns it if it is correct

  //const { userId } = await auth();
  const session = await auth()

  if (!session) {
    throw new Error("User not authenticated")
  }

  const subscriptionLevel = await getUserSubscriptionLevel(session.user?.id!);

  if (!id) {
    const resumeCount = await db.resume.count({
      where: {
        userId: session.user.id
      }
    });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Alcanzaste el máximo de currículums permitidos para tu suscripción actual"
        //"Maximum resume count reached for this subscription level",
      )
    }
  }

  const existingResume = id
    ? await db.resume.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    })
    : null

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    return db.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return db.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}




export async function generateSummary(input: GenerateSummaryInput) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(session.user?.id!);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(session.user?.id!);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}


export async function deleteResume(id: string) {

  // ! TODO: We must validate the session
  const session = await auth();

  const resume = await db.resume.findUnique({
    where: {
      id,
      // userId, -> Use userId from our db to validate the session
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // if (resume.photoUrl) {
  //   await del(resume.photoUrl);
  // }

  await db.resume.delete({
    where: {
      id,
    },
  });

  revalidatePath("/resumes");
}




// export async function createCustomerPortalSession() {
//   const user = await currentUser();

//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   const stripeCustomerId = user.privateMetadata.stripeCustomerId as
//     | string
//     | undefined;

//   if (!stripeCustomerId) {
//     throw new Error("Stripe customer ID not found");
//   }

//   const session = await stripe.billingPortal.sessions.create({
//     customer: stripeCustomerId,
//     return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
//   });

//   if (!session.url) {
//     throw new Error("Failed to create customer portal session");
//   }

//   return session.url;
// }