import { z } from "zod";

export const walletSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(50),
  amount: z.coerce.number().gte(0),
  type: z.string(),
  color: z.string().default("red").optional(),
  icon: z.string().emoji().optional(),
});

export type Wallet = z.infer<typeof walletSchema>;
