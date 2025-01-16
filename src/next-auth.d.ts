import { DefaultSession, DefaultUser } from "next-auth";

// Extiende el objeto de usuario
//declare module "next-auth" {
declare module "next-auth" {
  interface Session {
    user: {
      id: string // Agrega el campo `id` al usuario
      iat?: string
      exp?: string
      jti?: string // Unique identifier for the JWT
      sub?: string // Says who is the owner of the token
    } & DefaultSession["user"];
    token?: JwtToken; // Agrega el campo `token` a la sesión
  }

  interface User extends DefaultUser {
    id: string; // El ID del usuario (necesario si lo incluyes en el token)
  }
}

// Tipo personalizado para el token JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Agrega el ID del usuario al token JWT
  }
}
