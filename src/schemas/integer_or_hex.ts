import { z } from "zod"

export const intOrHexSchema = ({
  bits = 16,
  signed = false,
}: {
  bits?: number
  signed?: boolean
}) => {
  let max = Math.pow(2, bits)
  let min = 0

  if (signed) {
    max = Math.pow(2, bits - 1)
    min = -Math.pow(2, bits - 1)
  }

  return z.union([
    z.number().int().lte(max).gte(min),
    z.string().refine((val) => {
      const parsedVal = parseInt(val, 16)
      return parsedVal >= min && parsedVal <= max
    }),
  ])
}
