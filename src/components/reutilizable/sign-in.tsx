import { signIn } from "@/auth"
import { Github } from "lucide-react"

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github", { callbackUrl: "/resumes" })
      }}
    >

      <button type="submit" className="flex space-x-2 items-center justify-center w-full px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition">
        <Github />
        <span className="mt-0.5">
          Signin with GitHub
        </span>
      </button>

    </form>
  )
} 