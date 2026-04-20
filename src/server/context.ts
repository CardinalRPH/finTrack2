import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { getServerSession } from "next-auth"

export const createContext = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { user: null, prisma }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  return {
    user,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>