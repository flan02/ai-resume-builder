import { auth } from "@/auth";
import SignIn from "@/components/reutilizable/sign-in";



type Props = {}

export default async function Home() {
  const session = await auth()
  return (
    <div>
      {
        session
          ? <h1 className={`font-mono`}>AI RESUME BUILDER</h1>
          : <SignIn />
      }

    </div>
  );
}
