import { initTRPC } from '@trpc/server'
import { Context } from './context'

const t = initTRPC.context<Context>().create()

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new Error("UNAUTHORIZED")
    }

    return next({
        ctx: {
            user: ctx.user,
        },
    })
})


export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)