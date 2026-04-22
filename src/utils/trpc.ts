'use client'


import type { AppRouter } from '@/server/routers/app'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: '/api/trpc',
            headers() {
                const token = localStorage.getItem('token')

                return {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            },
        }),
    ],
})