

import { createTRPCRouter } from '../trpc'
import { statisticRouter } from './statisticRouter'
import { walletRouter } from './walletRouter'

export const appRouter = createTRPCRouter({
    wallet: walletRouter,
    statistic: statisticRouter
})

export type AppRouter = typeof appRouter