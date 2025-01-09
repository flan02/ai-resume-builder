import { auth } from "@/auth";
import logo from "../../public/logo.png";
import resumePreview from "../../public/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SignIn from "@/components/reutilizable/sign-in";
import { revalidatePath } from "next/cache";

export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-4 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-6">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
          priority
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Crea tu propio{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Curriculum Perfecto
          </span>{" "}
          en Minutos
        </h1>
        <p className="text-lg text-gray-500">
          El agente de <span className="font-bold">Inteligencia Artificial</span> te ayudara
          a diseñar un curriculum profesional, incluso si no tienes experiencias previas.
        </p>
        {/* <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get started</Link>
        </Button> */}
        <SignIn />
      </div>
      <div>
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
