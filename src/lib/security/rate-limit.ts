import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client for Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * NanoPay Rate Limiter
 * 
 * Provides tiered rate limiting based on x402 payment status.
 */
export class NanoPayLimiter {
  // Public Rate: 10 requests per minute
  publicLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1m"),
    prefix: "nanopay:public",
  });

  // Paid Rate (x402): 100 requests per minute
  paidLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1m"),
    prefix: "nanopay:paid",
  });

  async check(identifier: string, isPaid: boolean) {
    const limiter = isPaid ? this.paidLimit : this.publicLimit;
    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    return {
      success,
      limit,
      reset,
      remaining,
    };
  }
}

export const nanoPayLimiter = new NanoPayLimiter();
