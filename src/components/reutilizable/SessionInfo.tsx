import { formatTimestamp, getFormattedTimeRemaining, getTimeRemaining, isSessionActive } from "@/lib/utils";
import { Session } from "next-auth";

type SessionProps = {
  session: Session
}

const SessionInfo = ({ session }: SessionProps) => {

  if (!session.user) {
    return null;
  }

  const isSession = session?.user.exp ? isSessionActive(parseInt(session.user.exp)) : false;
  return (
    <div className="absolute bottom-0 right-0 mr-1 mb-1 w-max bg-opacity-50 bg-black dark:text-muted-foreground text-gray-300 text-xs p-8">
      <pre className="">
        SESSION INFO &nbsp;
        {
          JSON.stringify(session?.user, null, 2)
        }
      </pre>
      <br />
      <pre className="underline">CUSTOM FUNCTIONS</pre>
      <pre className="">
        {
          isSession ? "session status: active" : "session status: inactive"
        }
      </pre>
      <pre>
        {
          `issuedAt: ${session.user.iat ? formatTimestamp(parseInt(session.user.iat)) : 'N/A'}`
        }
      </pre>
      <pre className="">

        {
          `expiresAt: ${session?.user.exp ? formatTimestamp(parseInt(session.user.exp)) : 'N/A'}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in days: ${session?.user.exp ? getTimeRemaining(parseInt(session.user.exp), 'd') : 'N/A'}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in hours: ${session?.user.exp ? getTimeRemaining(parseInt(session.user.exp), 'h') : 'N/A'}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in minutes: ${session?.user.exp ? getTimeRemaining(parseInt(session.user.exp), 'm') : 'N/A'}`
        }
      </pre>
      <pre className="">

        {
          `session remaining in seconds: ${session?.user.exp ? getTimeRemaining(parseInt(session.user.exp), 's') : 'N/A'}`
        }
      </pre>

      <pre className="">

        {
          `total session time remaining: ${session?.user.exp ? getFormattedTimeRemaining(parseInt(session.user.exp)) : 'N/A'}`
        }
      </pre>

    </div>
  )
}

export default SessionInfo


