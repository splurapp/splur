import { z } from "zod";

export const WalletType = z.enum(["Cash", "Bank", "CreditCard"]);

export const walletSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(50),
  amount: z.coerce.number().gte(0),
  type: WalletType,
  color: z.string().default("red").optional(),
  icon: z.string().emoji().optional(),
});

export type Wallet = z.infer<typeof walletSchema>;

export const CategoryType = z.enum(["Income", "Expense"]);

export const categorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(50),
  icon: z.string().emoji(),
  color: z.string(),
  types: CategoryType.array(),
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
  walletId: z.coerce.number().optional(),
  timestamp: z.coerce.date(),
  amount: z.coerce.number().gte(0),
  title: z.string().optional(),
  desc: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  exchangeType: ExchangeType,
  exchanger: z.string().optional(), // Person, UPI ID, BANK ACCOUNT One Liner Details, Mobile Number
  transferFrom: z.coerce.number().optional(),
  transferTo: z.coerce.number().optional(),
  autoCategoryMap: z.boolean().default(false).optional(),
  recurringId: z.coerce.number().optional(),
  loanId: z.coerce.number().optional(),
});

export type SplurTransaction = z.infer<typeof transactionSchema>;

export type TransactionExtraData = Partial<{
  assignedToWallet: Wallet;
  transferFromWallet: Wallet;
  transferToWallet: Wallet;
  category: Category;
}>;

export type SplurTransactionWithData = SplurTransaction & TransactionExtraData;
