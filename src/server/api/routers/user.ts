import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  findUser: protectedProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.userId
        },
        include: {
          accounts: true
        }
      })
    }),
  updateDiscordData: protectedProcedure
    .input(z.object({
      username: z.string(),
      discriminator: z.string()
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          username: input.username,
          discriminator: input.discriminator
        }
      })
    })
})
