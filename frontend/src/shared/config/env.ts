import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().min(1).default('/api'),
    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const processEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
};

// Safe parsing to allow build to proceed even if env is invalid (will throw at runtime usage if critical)
// Or better, throw immediately to fail fast.
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // Throwing error here might break build if env vars are missing during build time
    // defaulting values in schema helps.
}

export const env = parsed.success ? parsed.data : envSchema.parse(processEnv);
