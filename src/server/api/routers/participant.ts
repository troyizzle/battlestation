import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createParticipantSchema } from "../../../schema/participant.schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const participantRouter = createTRPCRouter({
  getAllWithVoteSum: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.$queryRaw<{ username: string, score: number }[]>(
      Prisma.sql`
        SELECT "Participant"."username", SUM("rating") as score
        FROM "Participant"
          LEFT JOIN "Vote" ON "Vote"."participantId" = "Participant"."id"
          LEFT JOIN "User" ON "User"."username" = "Participant"."username"
            AND "User"."discriminator" = "Participant"."discriminator"
        GROUP BY "Participant"."username"
        ORDER BY SUM("rating") desc`
    );
  }),
  getAllVoteData: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.$queryRaw<{ username: string, image: string | null, rating: number, votingusername: string }[]>(
      Prisma.sql`
        SELECT "Participant"."username",
        "User"."image",
        "Vote"."rating",
        "votingUser"."username" as votingUserName
        FROM "Participant"
          LEFT JOIN "User" On "User"."username" = "Participant"."username"
          LEFT JOIN "Vote" ON "Vote"."participantId" = "Participant"."id"
          LEFT JOIN "User" "votingUser" ON "votingUser"."id" = "Vote"."userId"
      `
    )
  }),
  getAllWithVote: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.participant.findMany({
      include: {
        submissions: true,
        votes: true,
      },
    })
  }),
  findAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.participant.findMany({
        include: {
          _count: {
            select: {
              submissions: true
            }
          }
        }
      })
    }),
  findForVoting: protectedProcedure.input(z.object({
    username: z.string(),
    discriminator: z.string()
  })).query(({ input, ctx }) => {
    return ctx.prisma.participant.findMany({
      where: {
        NOT: {
          username: input.username,
          discriminator: input.discriminator,
          votes: {
            some: {
              userId: ctx.session.user.id
            }
          }
        }
      },
      include: {
        submissions: true,
        votes: true
      }
    })
  }),
  create: publicProcedure
    .input(createParticipantSchema)
    .mutation(({ ctx, input }) => {
      const formData = {
        ...input,
        submissions: {
          create: input.submissions,
        },
      };
      return ctx.prisma.participant.create({ data: formData });
    })
})
