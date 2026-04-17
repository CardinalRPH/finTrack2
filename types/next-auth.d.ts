// next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains the session data and the user's ID.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}