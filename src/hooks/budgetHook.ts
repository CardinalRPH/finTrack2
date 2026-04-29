import { getAllBudgetSchemaType } from "@/server/schemas/budgetSchema";
import { trpc } from "@/utils/trpc";

export const useGetAvaiMonthYear = () => trpc.budget.getAvaiYear.useQuery()
export const useGetBudget = ({ filter }: { filter: getAllBudgetSchemaType }) => trpc.budget.getAllData.useQuery(filter)
export const useCreateBudget = () => {
    const utils = trpc.useUtils();
    return trpc.budget.createData.useMutation({
        onSuccess: () => {
            utils.budget.getAllData.invalidate()
            utils.budget.getAvaiYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useUpdateBudget = () => {
    const utils = trpc.useUtils();
    return trpc.budget.updateData.useMutation({
        onSuccess: () => {
            utils.budget.getAllData.invalidate()
            utils.budget.getAvaiYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useDeleteBudget = () => {
    const utils = trpc.useUtils();
    return trpc.budget.deleteData.useMutation({
        onSuccess: () => {
            utils.budget.getAllData.invalidate()
            utils.budget.getAvaiYear.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}