import PremiumModal from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscription";

import Navbar from "./Navbar";

// TODO: It will make subscription level available to all components
import SubscriptionLevelProvider from "./SubscriptionLevelProvider"

import { auth } from "@/auth";
import SignIn from "@/components/reutilizable/sign-in";
//import SessionInfo from "@/components/reutilizable/SessionInfo";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  //console.log(session?.user.id)
  if (!session?.user?.name) {
    return <SignIn />
  }

  const userSubscriptionLevel = await getUserSubscriptionLevel(session.user?.id)

  return (
    <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
      <>
        {
          session.user.name && <div className="flex min-h-screen flex-col">
            <Navbar />
            {children} {/* You can use ssr components even though these are wrapped into the children props of a client component. They can still be ssr components */}
            <PremiumModal />
            {/* <SessionInfo session={session} /> */}
          </div>
        }
      </>
    </SubscriptionLevelProvider>
  )
}