import { z } from "zod"

const keycodeSchema = z.union([
  z.literal("pad_btn_a"),
  z.literal("pad_btn_b"),
  z.literal("pad_btn_x"),
  z.literal("pad_btn_y"),
  z.literal("pad_trig_l"),
  z.literal("pad_trig_r"),
  z.literal("pad_btn_start"),
  z.literal("pad_btn_select"),
])

export const inputJsonSchema = z.strictObject({
  input: z.strictObject({
    magic: z.literal("APF_VER_1"),
    controllers: z.optional(
      z.array(
        z.strictObject({
          type: z.literal("default"),
          mappings: z.array(
            z.strictObject({
              id: z.union([
                z.number().nonnegative().max(65_535),
                z.string().refine((val) => /^#[0-9A-F]{6}$/i.test(val)),
              ]),
              name: z.string().max(19),
              key: keycodeSchema,
            })
          ),
        })
      )
    ),
  }),
})
