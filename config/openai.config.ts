interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  maxRetries?: number;
  timeout?: number;
  rateLimitRequests?: number;
  rateLimitTokens?: number;
  maxTokens?: number;
  temperature?: number;
}

export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY;
  const organization = process.env.OPENAI_ORGANIZATION;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return {
    apiKey,
    organization,
    maxRetries: Number(process.env.OPENAI_MAX_RETRIES) || 3,
    timeout: Number(process.env.OPENAI_TIMEOUT) || 30000,
    rateLimitRequests: Number(process.env.OPENAI_RATE_LIMIT_REQUESTS) || 60,
    rateLimitTokens: Number(process.env.OPENAI_RATE_LIMIT_TOKENS) || 150000,
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 2000,
    temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
  };
} 