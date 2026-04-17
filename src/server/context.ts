import { cookies } from "next/headers"
import { jwtVerify } from "@/utils/jwtDeps"
import { jwtUserDto } from "@/dto/userDTO"
import { prisma } from "@/libs/prisma"

export const createContext = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    let user = null

    if (token) {
        try {
            const { userId } = jwtVerify(token) as jwtUserDto
            const isExistUser = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                omit: {
                    password: true
                }
            })
            if (!isExistUser) {
                user = null
            } else {
                user = isExistUser
            }
        } catch {
            user = null
        }
    }

    return { user }
}

export type createContextType = typeof createContext