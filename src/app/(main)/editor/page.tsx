
import { resumeDataInclude } from "@/lib/types";

import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { auth } from "@/auth";
import { db } from "@/db";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }> // * New in nextjs15. It converts the query params to a promise async-await
}

export const metadata: Metadata = {
  title: "Diseña tu curriculum"
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams // ? Here, we need to use await because searchParams is a promise

  const session = await auth()

  if (!session) {
    return null
  }

  // ! THIS QUERY MUST BE ADAPTED TO MONGODB SCHEMA
  const resumeToEdit = resumeId
    ? await db.resume.findUnique({
      where: {
        id: resumeId,
        userId: session.user.id
      },
      include: resumeDataInclude // include: { workExperiences: true, educations: true }
    })
    : null

  return <ResumeEditor resumeToEdit={resumeToEdit} sessionPhoto={session.user.image} />
}