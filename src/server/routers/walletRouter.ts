import { walletService } from "../services/walletService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const walletRouter = createTRPCRouter({
    getData:protectedProcedure.query(async ({ctx})=> await walletService.getData({ctx}))
})