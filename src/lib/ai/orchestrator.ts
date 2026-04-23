import OpenAI from "openai";
import { getAgentReputation } from "@/lib/contracts/agent-identity";

export type AiTask = "chat" | "summarize" | "analyze" | "extract";

export type AiRouteInput = {
  task: AiTask;
  prompt: string;
  budgetUsd?: number;
  paidAmountUsdc?: number;
};

export type AiRouteSelection = {
  provider: "featherless" | "aiml";
  model: string;
  priceUsd: number;
  specialistId: string;
  specialistName: string;
  providerPayoutAddress: string;
  reputation?: {
    score: number;
    totalRatings: number;
  };
};

export type AiGenerationResult = AiRouteSelection & {
  output: string;
};

type ProviderConfig = {
  baseURL?: string;
  apiKey?: string;
  defaultModel: string;
};

type SpecialistConfig = {
  key: AiTask | "elite";
  name: string;
  specialistId: string;
  provider: "featherless" | "aiml";
  model: string;
  payoutAddress: string;
};

const SPECIALIST_MAP: Record<AiTask, Record<"standard" | "premium", Omit<AiRouteSelection, "priceUsd" | "specialistId" | "specialistName" | "providerPayoutAddress" | "reputation"> & { specialistId: string; name: string }>> = {
  chat: {
    standard: { provider: "featherless", model: "llama-3.1-8b-instruct", specialistId: "chat-standard", name: "Standard Chat" },
    premium: { provider: "aiml", model: "gpt-4o-mini", specialistId: "chat-premium", name: "Elite Chat" },
  },
  summarize: {
    standard: { provider: "featherless", model: "phi-3-mini-128k-instruct", specialistId: "summarize-standard", name: "Quick Summarizer" },
    premium: { provider: "aiml", model: "gpt-4o-mini", specialistId: "summarize-premium", name: "Deep Summarizer" },
  },
  analyze: {
    standard: { provider: "featherless", model: "hermes-2-pro-llama-3-8b", specialistId: "analyze-standard", name: "Standard Analyst" },
    premium: { provider: "aiml", model: "claude-3-5-sonnet", specialistId: "analyze-premium", name: "Elite Analyst" },
  },
  extract: {
    standard: { provider: "featherless", model: "phi-3-mini-4k-instruct", specialistId: "extract-standard", name: "Standard Extractor" },
    premium: { provider: "aiml", model: "gpt-4o-mini", specialistId: "extract-premium", name: "Elite Extractor" },
  },
};

const MICRO_BUDGET_THRESHOLD = 0.005;
const PREMIUM_BUDGET_THRESHOLD = 0.02;
const MIN_SPECIALIST_REPUTATION = Number(
  process.env.MIN_SPECIALIST_REPUTATION_SCORE ?? 4.2,
);

export class SmartRouter {
  private readonly providers: Record<"aiml" | "featherless", ProviderConfig>;
  private readonly fallbackClient?: OpenAI;

  constructor() {
    this.providers = {
      aiml: {
        baseURL: process.env.AIML_API_BASE_URL ?? "https://api.aimlapi.com/v1",
        apiKey: process.env.AIML_API_KEY,
        defaultModel: process.env.AIML_API_DEFAULT_MODEL ?? "gpt-4o-mini",
      },
      featherless: {
        baseURL: process.env.FEATHERLESS_API_BASE_URL ?? "https://api.featherless.ai/v1",
        apiKey: process.env.FEATHERLESS_API_KEY,
        defaultModel: process.env.FEATHERLESS_API_DEFAULT_MODEL ?? "llama-3.1-8b-instruct",
      },
    };

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.fallbackClient = new OpenAI({ apiKey: openaiKey });
    }
  }

  async getOptimalModel(input: AiRouteInput): Promise<AiRouteSelection> {
    const budget = input.paidAmountUsdc ?? input.budgetUsd ?? 0.01;
    const isPremium = budget >= PREMIUM_BUDGET_THRESHOLD;
    
    // Select the base specialist configuration
    const tier = isPremium ? "premium" : "standard";
    const baseSpec = SPECIALIST_MAP[input.task][tier];

    // Check on-chain reputation if a 0x specialistId is used (v2 expansion)
    const reputation = await this.safeGetReputation(baseSpec.specialistId);

    // Dynamic downgrade/upgrade based on reputation if needed
    let finalSpec = baseSpec;
    if (isPremium && reputation && reputation.score < MIN_SPECIALIST_REPUTATION) {
      // In a real swarm, we'd find another premium provider here
      console.warn(`Premium specialist ${baseSpec.name} has low reputation. Falling back to default premium.`);
    }

    return {
      provider: finalSpec.provider,
      model: finalSpec.model,
      priceUsd: budget,
      specialistId: finalSpec.specialistId,
      specialistName: finalSpec.name,
      providerPayoutAddress: process.env.PLATFORM_WALLET_ADDRESS ?? "", // Default for now
      reputation: reputation ?? undefined,
    };
  }

  async generate(input: AiRouteInput): Promise<AiGenerationResult> {
    const route = await this.getOptimalModel(input);
    const client = this.getClient(route.provider);

    const response = await client.chat.completions.create({
      model: route.model,
      messages: [
        {
          role: "system",
          content:
            "You are NanoPay's payment-gated agent brain. Answer concisely, preserve structured output when the user asks for extraction, and keep the response production-safe.",
        },
        { role: "user", content: input.prompt },
      ],
      temperature: route.provider === "aiml" ? 0.4 : 0.2,
    });

    const output = response.choices[0]?.message?.content?.trim() ?? "";

    return {
      ...route,
      output,
    };
  }

  private async safeGetReputation(specialistId: string) {
    if (!specialistId.startsWith("0x") || specialistId.length !== 42) {
      return null;
    }

    try {
      return await getAgentReputation(specialistId as `0x${string}`);
    } catch {
      return null;
    }
  }

  private getClient(provider: "aiml" | "featherless"): OpenAI {
    const config = this.providers[provider];

    if (!config.apiKey) {
      if (this.fallbackClient) {
        return this.fallbackClient;
      }

      throw new Error(`Missing API key for ${provider.toUpperCase()}`);
    }

    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }
}

const router = new SmartRouter();

export function getSmartRouter() {
  return router;
}
