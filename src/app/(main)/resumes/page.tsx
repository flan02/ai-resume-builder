import { canCreateResume } from "@/lib/permissions";
import { db } from "@/db";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";

import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";
import logo from "../../public/logo.png";
import resumePreview from "../../public/resume-preview.jpg";
import { auth } from "@/auth";
import SignIn from "@/components/reutilizable/sign-in";
import SessionInfo from "@/components/reutilizable/SessionInfo";


export const metadata: Metadata = {
  title: "Tus curriculums",
};

export default async function Page() {

  const session = await auth()
  console.log(session)


  if (!session?.user?.id) {
    return <p>Error</p>
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    db.resume.findMany({
      where: {
        userId: session.user?.id
      },
      orderBy: {
        updatedAt: "desc"
      },
      include: resumeDataInclude
    }),
    db.resume.count({
      where: {
        userId: session.user?.id
      }
    }),
    getUserSubscriptionLevel(session.user?.id!)
  ])


  // const totalCount = 2;
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateResumeButton
        //  canCreate={canCreateResume(subscriptionLevel, totalCount)}
        canCreate={true}
        totalCount={totalCount}
      />
      <div className="space-y-1">
        <h1 className="text-3xl dark:text-yellow-50 font-bold text-black">Aqui estaran tus curriculums</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">

        {/* {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))} */}
      </div>
    </main>
  )
}