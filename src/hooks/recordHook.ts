import { getAllRecordSchemaType } from "@/server/schemas/recordSchema";
import { trpc } from "@/utils/trpc";

export const useGetRecord = ({ filter }: { filter: getAllRecordSchemaType }) => trpc.record.getAllData.useQuery(filter)
export const useCreateRecord = () => {
    const utils = trpc.useUtils();
    return trpc.record.createData.useMutation({
        onSuccess: () => {
            utils.record.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useUpdateRecord = () => {
    const utils = trpc.useUtils();
    return trpc.record.updateData.useMutation({
        onSuccess: () => {
            utils.record.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useDeleteRecord = () => {
    const utils = trpc.useUtils();
    return trpc.record.deleteData.useMutation({
        onSuccess: () => {
            utils.record.getAllData.invalidate()
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}