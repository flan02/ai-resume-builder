import PremiumModal from "@/components/premium/PremiumModal";
//import { getUserSubscriptionLevel } from "@/lib/subscription";

import Navbar from "./Navbar";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";
import { auth } from "@/auth";
import SignIn from "@/components/reutilizable/sign-in";
import SessionInfo from "@/components/reutilizable/SessionInfo";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  console.log(session?.user.id);
  if (!session?.user?.name) {
    return <SignIn />
  }

  //const userSubscriptionLevel = await getUserSubscriptionLevel(session.user?.id);

  return (
    // <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
    <>
      {
        session.user.name && <div className="flex min-h-screen flex-col">
          <Navbar />
          {children}
          <PremiumModal />
          <SessionInfo session={session!} />
        </div>
      }
    </>
    // </SubscriptionLevelProvider>
  );
}