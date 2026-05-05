import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { delByPattern, delCache, getCache, setCache } from "@/libs/redis"
import { getServerSession } from "next-auth"
import { User } from "../../generated/prisma/client"

export const createContext = async () => {
  const session = await getServerSession(authOptions)


  if (!session?.user?.email) {
    return {
      user: null,
      prisma,
      cache: { setCache, getCache, delCache, delByPattern }
    }
  }

  const cacheKey = `fintrack:${btoa(session.user.email)}`

  let user: User | null
  const redUser = await getCache<User>(cacheKey)
  if (redUser) {
    user = redUser
  } else {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })
    await setCache(cacheKey, JSON.stringify(user))

  }


  return {
    user,
    prisma,
    cache: { setCache, getCache, delCache, delByPattern }
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>