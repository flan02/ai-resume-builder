
import { resumeDataInclude } from "@/lib/types";

import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { auth } from "@/auth";
import { db } from "@/db";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const session = await auth();


  if (!session) {
    return null;
  }

  const userId = session.user?.id;

  // ! THIS QUERY MUST BE ADAPTED TO MONGODB SCHEMA
  const resumeToEdit = resumeId
    ? await db.resume.findUnique({
      where: { id: resumeId, userId },
      include: resumeDataInclude,
    })
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}