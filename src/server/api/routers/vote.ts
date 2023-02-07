import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const voteRouter = createTRPCRouter({
  cast: protectedProcedure
    .input(z.object({
      rating: z.number(),
      participantId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vote.create({
        data: {
          participantId: input.participantId,
          userId: ctx.session.user.id,
          rating: input.rating
        }
      })
    })
})
