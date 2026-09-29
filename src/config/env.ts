import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info"),
    GROQ_API_KEY: z.string().trim().optional(),
    GROQ_MODEL: z.string().trim().min(1).default("qwen/qwen3.8-27b"),
    WHATSAPP_ACCESS_TOKEN: z.string().trim().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().trim().optional(),
    WHATSAPP_VERIFY_TOKEN: z.string().trim().optional(),
    WHATSAPP_APP_SECRET: z.string().trim().optional(),
    WHATSAPP_API_VERSION: z
        .string()
        .regex(/^v\d+\.\d+$/)
        .default("v23.0"),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
    ...parsedEnv,
    GROQ_API_KEY: parsedEnv.GROQ_API_KEY || undefined,
    WHATSAPP_ACCESS_TOKEN: parsedEnv.WHATSAPP_ACCESS_TOKEN || undefined,
    WHATSAPP_PHONE_NUMBER_ID: parsedEnv.WHATSAPP_PHONE_NUMBER_ID || undefined,
    WHATSAPP_VERIFY_TOKEN: parsedEnv.WHATSAPP_VERIFY_TOKEN || undefined,
    WHATSAPP_APP_SECRET: parsedEnv.WHATSAPP_APP_SECRET || undefined,
};
