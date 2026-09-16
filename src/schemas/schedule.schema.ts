import { z } from 'zod'

const diaHorarioSchema = z .object({
    descanso: z.boolean(),
    entrada: z.string(),
    salida: z.string(),
  })
  .superRefine((dia, ctx) => {
    // Si es día de descanso, no se valida horarios
    if (dia.descanso) {
      return
    }

    // Entrada obligatoria
    if (!dia.entrada) {
      ctx.addIssue({
        code: 'custom',
        path: ['entrada'],
        message: 'La hora de entrada es obligatoria',
      })
    }

    // Salida obligatoria
    if (!dia.salida) {
      ctx.addIssue({
        code: 'custom',
        path: ['salida'],
        message: 'La hora de salida es obligatoria',
      })
    }

    // Si ambas existen, la salida debe ser posterior
    if (dia.entrada && dia.salida && dia.entrada >= dia.salida) {
      ctx.addIssue({
        code: 'custom',
        path: ['salida'],
        message: 'La salida debe ser posterior a la entrada',
      })
    }
  })

export const horarioSchema = z.object({
  lunes: diaHorarioSchema,
  martes: diaHorarioSchema,
  miercoles: diaHorarioSchema,
  jueves: diaHorarioSchema,
  viernes: diaHorarioSchema,
  sabado: diaHorarioSchema,
  domingo: diaHorarioSchema,
})

export type HorarioForm = z.infer<typeof horarioSchema>