import { trpc } from "@/utils/trpc";

export const useGetWallet = () => trpc.wallet.getAllData.useQuery()
export const useCreateWallet = () => {
    const utils = trpc.useUtils();
    return trpc.wallet.createData.useMutation({
        onSuccess: () => {
            utils.wallet.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useUpdateWallet = () => {
    const utils = trpc.useUtils();
    return trpc.wallet.updateData.useMutation({
        onSuccess: () => {
            utils.wallet.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useDeleteWallet = () => {
    const utils = trpc.useUtils();
    return trpc.wallet.deleteData.useMutation({
        onSuccess: () => {
            utils.wallet.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}