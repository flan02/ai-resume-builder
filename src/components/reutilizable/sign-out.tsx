


import { signOut } from "@/auth"

type Props = {}

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >

      <button type="submit" className="flex space-x-2 text-sm items-center justify-center w-full px-1 mt-0.5 py-1 ml-4 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition">
        <span className="mt-0.5">
          Sign Out
        </span>
      </button>

    </form>
  )
}

export default SignOut