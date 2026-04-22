import { trpc } from "@/utils/trpc";

export const useGetDashboard = () => trpc.dashboard.getData.useQuery()