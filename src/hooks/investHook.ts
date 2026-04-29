import { investDashboardSchemaType } from "@/server/schemas/investSchema";
import { trpc } from "@/utils/trpc";

export const useGetInvest = () => trpc.investment.getAllData.useQuery()
export const useGetInvestDashboard = ({ filter }: { filter: investDashboardSchemaType }) => trpc.investment.getDashboardData.useQuery(filter)
export const useGetInvestYear = () => trpc.investment.getDashboardYear.useQuery()
export const useCreateInvest = () => {
    const utils = trpc.useUtils();
    return trpc.investment.createData.useMutation({
        onSuccess: () => {
            utils.investment.getAllData.invalidate()
            utils.investment.getDashboardData.invalidate()
            utils.investment.getDashboardYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useUpdateInvest = () => {
    const utils = trpc.useUtils();
    return trpc.investment.updateData.useMutation({
        onSuccess: () => {
            utils.investment.getAllData.invalidate()
            utils.investment.getDashboardData.invalidate()
            utils.investment.getDashboardYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useDeleteInvest = () => {
    const utils = trpc.useUtils();
    return trpc.investment.deleteData.useMutation({
        onSuccess: () => {
            utils.investment.getAllData.invalidate()
            utils.investment.getDashboardData.invalidate()
            utils.investment.getDashboardYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}