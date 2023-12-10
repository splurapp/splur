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

export const categorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(50),
  icon: z.string().emoji(),
  color: z.string(), // TODO: use default and make it optional
});

export type Category = z.infer<typeof categorySchema>;
