import z from 'zod'

export const createSubmissionSchema = z.object({
  url: z.string()
})

export type CreateSubmissionSchema = z.TypeOf<typeof createSubmissionSchema>
