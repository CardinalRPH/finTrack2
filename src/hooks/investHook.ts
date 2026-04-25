import { trpc } from "@/utils/trpc";

export const useGetInvest = () => trpc.investment.getAllData.useQuery()