import { signIn } from "@/auth"
import { Github } from "lucide-react"
import GoogleWrapButton from "./GoogleWrapButton"


export default function SignIn() {
  return (

    <>
      <GoogleWrapButton />
      <form
        action={async () => {
          "use server"
          await signIn("github", { callbackUrl: "/resumes" })
        }}
      >

        <button type="submit" className="flex space-x-5 items-center justify-center w-full px-4 py-3 text-white text-md bg-gray-900 hover:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition">
          <Github />
          <span className="mt-0.5 lg:text-base">
            Inicia sesion con Github
          </span>
        </button>

      </form>


    </>


  )
} 