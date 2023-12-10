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

export const ExchangeType = z.enum([
  "Income",
  "Expense",
  "Transfer",
  "Lend",
  "SubLend",
  "Borrow",
  "SubBorrow",
]);

export const transactionSchema = z.object({
  id: z.coerce.number().optional(),
  assignedTo: z.coerce.number().optional(),
  timestamp: z.coerce.date(),
  amount: z.coerce.number().gte(0),
  title: z.string().optional(),
  desc: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  exchangeType: ExchangeType,
});

// TODO: use this type everywhere eventually
export type Transaction = z.infer<typeof transactionSchema>;
