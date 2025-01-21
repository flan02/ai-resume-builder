/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"
import { auth } from "@/auth"
import { db } from "@/db"
import { env } from "@/env"
import stripe from "@/lib/stripe"
//import { del, put } from "@vercel/blob";
import { getUserSubscriptionLevel } from "@/lib/subscription"

import { canCreateResume, canUseCustomizations } from "@/lib/permissions"

import { resumeSchema, ResumeValues } from "@/lib/validation"
import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions"
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
    const userFound = await db.user.findFirst({
      where: {
        email
      }
    })

    //console.log('isAdmin', isAdmin);
    if (!userFound) return null

    return userFound
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
  const session = await auth()

  if (!session?.user.id) {
    throw new Error("Unauthorized")
  }

  // const stripeCustomerId = user.privateMetadata.stripeCustomerId as | string | undefined
  const stripeCustomerId = session.user.id as | string | undefined
  const sessionBilling = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: session.user.email!,
    metadata: {
      userId: session.user.id,
    },
    subscription_data: {
      metadata: {
        userId: session.user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `Yo he leido los terminos de Curriculums asistido por IA [terminos de servicio](${env.NEXT_PUBLIC_BASE_URL}/tos) y estoy de acuerdo con ellos.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!sessionBilling.url) {
    throw new Error("Failed to create checkout session");
  }

  return sessionBilling.url
}




export async function saveResume(values: ResumeValues) {
  const { id } = values

  console.log("received values", values)

  const { photoUrl, workExperiences, educations, ...resumeValues } = resumeSchema.parse(values) // ? parse is a method that validates the data and returns it if it is correct

  //const { userId } = await auth();
  const session = await auth()

  if (!session?.user.id) {
    throw new Error("User not authenticated")
  }

  const subscriptionLevel = await getUserSubscriptionLevel(session?.user?.id)

  if (!id) {
    const resumeCount = await db.resume.count({
      where: {
        userId: session.user.id
      }
    });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level",
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
    throw new Error("Resume not found")
  }

  const hasCustomizations =
    (resumeValues.borderStyle && resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex)


  // if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
  //   throw new Error("Customizations not allowed for this subscription level");
  // }

  // ? We don't need that since we are not using the blob storage
  // let newPhotoUrl: string | undefined | null = undefined

  // if (photo instanceof File) {
  //   if (existingResume?.photoUrl) {
  //     await del(existingResume.photoUrl)
  //   }

  //   const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
  //     access: "public",
  //   });

  //   newPhotoUrl = blob.url;
  // } else if (photo === null) {
  //   if (existingResume?.photoUrl) {
  //     await del(existingResume.photoUrl);
  //   }
  //   newPhotoUrl = null
  // }

  if (id) {
    // * If the resume already exists, we update it
    return db.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: session.user.image!, // newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined
          }))
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          }))
        },
        //updatedAt: new Date()
      }
    })
  } else {
    // * If the resume doesn't exist, we create it

    return db.resume.create({
      data: {
        ...resumeValues,
        userId: session.user.id,
        photoUrl: session.user.image!,
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
            endDate: edu.endDate ? new Date(edu.endDate) : undefined
          }))
        }
      }
    })
  }
}



// TODO: This fc uses openai to generate a summary of the resume
export async function generateSummary(input: GenerateSummaryInput) {
  const session = await auth()

  if (!session) {
    throw new Error("Unauthorized")
  }

  // * In case we want to use the subscription level
  // const subscriptionLevel = await getUserSubscriptionLevel(session.user?.id!)

  // if (!canUseAITools(subscriptionLevel)) {
  //   throw new Error("Upgrade your subscription to use this feature");
  // }

  const { jobTitle, workExperiences, educations, skills } = generateSummarySchema.parse(input)

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `

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
      .join("\n\n")
    }

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")
    }

      Skills:
      ${skills}
    `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const completion = await openai.chat.completions.create({
    model: "chatgpt-4o-latest", // "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      }
    ]
  })

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse
}

export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  // * In case we want to use the subscription level
  // const subscriptionLevel = await getUserSubscriptionLevel(session.user?.id!);

  // if (!canUseAITools(subscriptionLevel)) {
  //   throw new Error("Upgrade your subscription to use this feature");
  // }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: DD-MM-YYYY> (only if provided)
  End date: <format: DD-MM-YYYY> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `

  const completion = await openai.chat.completions.create({
    model: "chatgpt-4o-latest", //"gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  })

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  // TODO: Regex to extract the fields from the AI response
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience
}


export async function deleteResume(id: string) {

  // ! TODO: We must validate the session
  const session = await auth()

  const resume = await db.resume.findUnique({
    where: {
      id,
      userId: session?.user.id
    }
  })

  if (!resume) {
    throw new Error("Resume not found")
  }

  // ? We don't need this since we are not using the blob storage
  // if (resume.photoUrl) {
  //   await del(resume.photoUrl)
  // }

  await db.resume.delete({
    where: {
      id
    }
  })

  revalidatePath("/resumes")
}




export async function createCustomerPortalSession() {
  const session = await auth()

  if (!session) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = session.user.id as | string | undefined

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID not found");
  }

  const sessionBilling = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
  });

  if (!sessionBilling.url) {
    throw new Error("Failed to create customer portal session");
  }

  return sessionBilling.url
}