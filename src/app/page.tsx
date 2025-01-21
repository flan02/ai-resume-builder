import { auth } from "@/auth";
import resumePreview from "../../public/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SignIn from "@/components/reutilizable/sign-in";
import { isSessionActive } from "@/lib/utils";

import { redirect } from "next/navigation";
import { BrainIcon } from "lucide-react";
import ThemeToggle from "@/components/reutilizable/ThemeToggle";



export default async function Home() {
  const session = await auth()
  //console.log(session?.user)
  if (session?.user?.exp && isSessionActive(parseInt(session?.user.exp))) {
    redirect("/resumes")
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-4 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="absolute right-3 top-2">
        <ThemeToggle />
      </div>
      <div className="max-w-prose space-y-6">
        <div className="flex items-end space-x-4">
          <div className="w-full flex items-end">
            <BrainIcon fill="rgb(168 85 247 / 0.8)" className="pr-2 text-purple-500/70 size-20" />
            <h1 className="text-7xl lg:text-7xl font-bold text-lime-950">CV</h1>
            <h1 className="text-7xl lg:text-7xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">AI</h1>
          </div>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-blue-950">
          Crea tu propio{" "}
          <span className="inline-block bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            Curriculum Perfecto
          </span>{" "}
          en minutos
        </h1>
        <p className="text-sm lg:text-lg text-gray-500 font-mono dark:td">
          El agente de <span className="font-bold">Inteligencia Artificial</span> te ayudara
          a diseñar un curriculum profesional, incluso si no tienes experiencia previa.
        </p>

        {/* HERE OPEN A MODAL COMPONENT GIVE SOME INFO ABOUT THE PROJECT */}
        <Button asChild size="lg" variant="default" className="text-xs px-2 lg:px-4 lg:text-sm bg-gray-300 hover:bg-gray-300/80 dark:bg-blue-950/80 dark:hover:bg-blue-950 text-gray-500 dark:text-muted-foreground">
          <Link href="/resumes">Conoce más</Link>
        </Button>

        <SignIn />
      </div>
      <div className="hidden lg:block">
        <Image
          src={resumePreview}
          alt="Resume preview"
          width={600}
          className="shadow-md lg:rotate-[1.5deg]"
          priority
        />
      </div>
    </main>
  );
}
