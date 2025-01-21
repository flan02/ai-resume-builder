import { canCreateResume } from "@/lib/permissions";
import { db } from "@/db";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";

import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";
import { auth } from "@/auth";



export const metadata: Metadata = {
  title: "Tus curriculums"
}

export default async function Page() {

  const session = await auth()
  //console.log(session)

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
    getUserSubscriptionLevel(session.user?.id)
  ])


  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateResumeButton
        canCreate={canCreateResume(subscriptionLevel, totalCount)}
        totalCount={totalCount}
      />
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono dark:text-yellow-50 font-bold text-black">Tus curriculums</h1>

        <p className="text-xs lg:text-md font-roboto underline text-muted-foreground">Total: {totalCount}</p>
      </div>
      <div className="flex w-full pb-12 space-y-2 md:pb-0 grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {
          resumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} sessionPhoto={session.user.image} />
          ))
        }
      </div>
    </main>
  )
}