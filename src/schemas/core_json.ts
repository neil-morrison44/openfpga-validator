import { z } from "zod"

export const coreJsonSchema = z.strictObject({
  core: z.strictObject({
    magic: z.literal("APF_VER_1"),
    metadata: z.strictObject({
      platform_ids: z.array(z.string()).max(4),
      shortname: z.string().max(31),
      description: z.string().max(63),
      author: z.string().max(31),
      url: z.optional(z.string().max(63)),
      version: z.string().max(31),
      date_release: z.string().max(10),
    }),
    framework: z.strictObject({
      target_product: z.literal("Analogue Pocket"),
      version_required: z.string(),
      sleep_supported: z.boolean(),
      chip32_vm: z.optional(z.string().max(15)),
      dock: z.strictObject({
        supported: z.boolean(),
        analog_output: z.boolean(),
      }),
      hardware: z.strictObject({
        link_port: z.boolean(),
        cartridge_adapter: z.union([z.literal(-1), z.literal(0)]),
      }),
    }),
    cores: z
      .array(
        z.strictObject({
          name: z.string().max(15),
          id: z.union([
            z.number().int().nonnegative(),
            z.string().refine((val) => /^#[0-9A-F]{6}$/i.test(val)),
          ]),
          filename: z.string().max(15),
        })
      )
      .max(8)
      .min(1),
  }),
})
