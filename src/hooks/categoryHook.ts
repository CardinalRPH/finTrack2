import { trpc } from "@/utils/trpc"

export const useGetCategory = () => trpc.category.getAllData.useQuery()
export const useCreateCategory = () => {
    const utils = trpc.useUtils();
    return trpc.category.createData.useMutation({
        onSuccess: () => {
            utils.category.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useUpdateCategory = () => {
    const utils = trpc.useUtils();
    return trpc.category.updateData.useMutation({
        onSuccess: () => {
            utils.category.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}

export const useDeleteCategory = () => {
    const utils = trpc.useUtils();
    return trpc.category.deleteData.useMutation({
        onSuccess: () => {
            utils.category.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}