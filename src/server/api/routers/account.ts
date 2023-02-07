import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  findAccount: protectedProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(({ input, ctx }) => {
      return ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      })
    })
})
