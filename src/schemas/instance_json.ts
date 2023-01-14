import { z } from "zod"
import { intOrHexSchema } from "./integer_or_hex"

export const instanceJsonSchema = z.strictObject({
  instance: z.strictObject({
    magic: z.literal("APF_VER_1"),
    data_path: z.string().max(255),
    core_select: z
      .optional(
        z.strictObject({
          id: intOrHexSchema({ bits: 16, signed: false }),
          select: z.boolean(),
        })
      )
      .optional(),
    // variant_select is missing from
    // https://www.analogue.co/developer/docs/core-definition-files/instance-json
    variant_select: z
      .optional(
        z.strictObject({
          id: intOrHexSchema({ bits: 16, signed: false }),
          select: z.boolean(),
        })
      )
      .optional(),
    data_slots: z
      .array(
        z.strictObject({
          id: intOrHexSchema({ bits: 16, signed: false }),
          filename: z.string().max(255),
        })
      )
      .max(32)
      .optional(),
    memory_writes: z.array(
      z.strictObject({
        address: intOrHexSchema({ bits: 32, signed: false }),
        data: intOrHexSchema({ bits: 32, signed: false }),
      })
    ),
  }),
})
