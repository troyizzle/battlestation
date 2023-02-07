import z from 'zod'
import { createSubmissionSchema } from './submission.schema'

export const createParticipantSchema = z.object({
  username: z.string(),
  discriminator: z.string(),
  submissions: z.array(createSubmissionSchema)
})

export type CreateParticipantInput = z.TypeOf<typeof createParticipantSchema>

