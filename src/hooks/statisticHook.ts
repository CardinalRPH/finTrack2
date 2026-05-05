import { getStatisticSchemaType } from "@/server/schemas/statisticSchema";
import { trpc } from "@/utils/trpc";

export const useGetBalance = ({ filter }: { filter: getStatisticSchemaType }) => trpc.statistic.getBalance.useQuery(filter)
export const useGetCashFlow = ({ filter }: { filter: getStatisticSchemaType }) => trpc.statistic.getCashFlow.useQuery(filter)
export const useGetSpending = ({ filter }: { filter: getStatisticSchemaType }) => trpc.statistic.getSpending.useQuery(filter)
export const useGetReport = ({ filter }: { filter: getStatisticSchemaType }) => trpc.statistic.getReport.useQuery(filter)