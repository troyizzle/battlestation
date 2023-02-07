import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { participantRouter } from "./routers/participant";
import { accountRouter } from "./routers/account";
import { voteRouter } from "./routers/vote";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  example: exampleRouter,
  participant: participantRouter,
  user: userRouter,
  vote: voteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
