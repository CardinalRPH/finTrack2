

import { createTRPCRouter } from '../trpc'
import { categoryRouter } from './categoryRouter'
import { dashboardRouter } from './dashboardRouter'
import { recordRouter } from './recordRouter'
import { statisticRouter } from './statisticRouter'
import { walletRouter } from './walletRouter'

export const appRouter = createTRPCRouter({
    wallet: walletRouter,
    category: categoryRouter,
    statistic: statisticRouter,
    record: recordRouter,
    dashboard: dashboardRouter
})

export type AppRouter = typeof appRouter