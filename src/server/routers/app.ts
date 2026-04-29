

import { createTRPCRouter } from '../trpc'
import { budgetRouter } from './budgetRouter'
import { categoryRouter } from './categoryRouter'
import { dashboardRouter } from './dashboardRouter'
import { investRouter } from './investRouter'
import { recordRouter } from './recordRouter'
import { statisticRouter } from './statisticRouter'
import { walletRouter } from './walletRouter'

export const appRouter = createTRPCRouter({
    wallet: walletRouter,
    category: categoryRouter,
    statistic: statisticRouter,
    record: recordRouter,
    dashboard: dashboardRouter,
    investment: investRouter,
    budget: budgetRouter
})

export type AppRouter = typeof appRouter