

import { createTRPCRouter } from '../trpc'
import { categoryRouter } from './categoryRouter'
import { statisticRouter } from './statisticRouter'
import { walletRouter } from './walletRouter'

export const appRouter = createTRPCRouter({
    wallet: walletRouter,
    category: categoryRouter,
    statistic: statisticRouter
})

export type AppRouter = typeof appRouter