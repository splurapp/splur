/**
 * This infers the type excluding the Promise
 * @example AsyncReturnType<Promise<Wallet>> --> Wallet
 */
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : unknown;
