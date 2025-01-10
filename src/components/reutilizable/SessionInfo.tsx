import { formatTimestamp, getFormattedTimeRemaining, getTimeRemaining, isSessionActive } from "@/lib/utils";
import { Session } from "next-auth";

type SessionProps = {
  session: Session
}

const SessionInfo = ({ session }: SessionProps) => {
  const isSession = isSessionActive(parseInt(session?.user.exp!));
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
          `total session time remaining: ${getFormattedTimeRemaining(parseInt(session?.user.exp!))}`
        }
      </pre>

    </div>
  )
}

export default SessionInfo


