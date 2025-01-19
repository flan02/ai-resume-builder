'use client'
import GoogleButton from 'react-google-button'
import { signIn } from "next-auth/react"

const GoogleWrapButton = () => {
  return (

    <GoogleButton
      onClick={() => signIn('google', { callbackUrl: '/resumes' })}
      style={{ width: "max-width", fontSize: "1rem" }}
      label="Inicia Sesion con Google"
    />

  )
}

export default GoogleWrapButton