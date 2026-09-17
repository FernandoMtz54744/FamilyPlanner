import { z } from 'zod'

export const eventSchema = z.object({
    start: z.string().min(1, 'El inicio es obligatorio'),
    end: z.string().min(1, 'El fin es obligatorio'),
    description: z
      .string()
      .min(1, 'La descripción es obligatoria'),
    location: z.string().optional(),
  })
  .superRefine((event, ctx) => {
    if (event.start && event.end && event.start >= event.end) {
      ctx.addIssue({
        code: 'custom',
        path: ['end'],
        message: 'El fin debe ser posterior al inicio',
      })
    }
  })

export type EventForm = z.infer<typeof eventSchema>