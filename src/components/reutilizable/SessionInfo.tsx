import { formatTimestamp, getFormattedTimeRemaining, getTimeRemaining, isSessionActive } from "@/lib/utils";
import { Session } from "next-auth";

type SessionProps = {
  session: Session
}

const SessionInfo = ({ session }: SessionProps) => {
  const isSession = isSessionActive(parseInt(session?.user.exp!));
  return (
    <div className="flex flex-col w-[500px]">

      <pre>
        {
          JSON.stringify(session?.user, null, 2)
        }
      </pre>
      <pre className="">
        {
          isSession ? "session status: active" : "session status: inactive"
        }
      </pre>
      <pre>
        {
          `issuedAt: ${formatTimestamp(parseInt(session?.user.iat!))}`
        }
      </pre>
      <pre className="">

        {
          `expiresAt: ${formatTimestamp(parseInt(session?.user.exp!))}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in days: ${getTimeRemaining(parseInt(session?.user.exp!), 'd')}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in hours: ${getTimeRemaining(parseInt(session?.user.exp!), 'h')}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in minutes: ${getTimeRemaining(parseInt(session?.user.exp!), 'm')}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in seconds: ${getTimeRemaining(parseInt(session?.user.exp!), 's')}`
        }
      </pre>

      <pre className="">

        {
          `total time remaining: ${getFormattedTimeRemaining(parseInt(session?.user.exp!))}`
        }
      </pre>

    </div>
  )
}

export default SessionInfo


