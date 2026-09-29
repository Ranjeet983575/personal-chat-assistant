import Groq from "groq-sdk";
import { env } from "../config/env.js";
import { assistantSystemPrompt, unknownReply } from "./profile.js";

const fallbackGroqModels = ["qwen/qwen3.8-27b", "allam-2-7b"];

export function getModelCandidates(preferredModel?: string): string[] {
    const candidates = new Set<string>();

    if (preferredModel && preferredModel.trim().length > 0) {
        candidates.add(preferredModel.trim());
    }

    for (const model of fallbackGroqModels) {
        candidates.add(model);
    }

    return [...candidates];
}

export function extractReplyText(
    completion: {
        choices?: Array<{
            message?: {
                content?: string | null | Array<{ text?: string | null; type?: string }>;
            };
        }>;
    },
): string | undefined {
    const content = completion.choices?.[0]?.message?.content;

    if (typeof content === "string") {
        return content.trim() || undefined;
    }

    if (Array.isArray(content)) {
        const extracted = content
            .map((chunk) => chunk?.text ?? "")
            .join("")
            .trim();

        return extracted || undefined;
    }

    return undefined;
}

export async function generateReply(message: string): Promise<string> {
    if (!env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const groq = new Groq({ apiKey: env.GROQ_API_KEY });
    const modelCandidates = getModelCandidates(env.GROQ_MODEL);
    let lastError: unknown;

    for (const model of modelCandidates) {
        try {
            const completion = await groq.chat.completions.create({
                model,
                temperature: 0.3,
                messages: [
                    { role: "system", content: assistantSystemPrompt },
                    { role: "user", content: message },
                ],
            });

            const reply = extractReplyText(completion);
            if (reply && reply.trim().length > 0) {
                return reply.trim();
            }

            lastError = new Error(`Groq model ${model} returned an empty reply`);
        } catch (error) {
            const normalizedError =
                error instanceof Error ? error : new Error(String(error));
            lastError = normalizedError;

            const messageText = normalizedError.message.toLowerCase();
            const isModelAccessIssue =
                messageText.includes("model_not_found") ||
                messageText.includes("do not have access") ||
                messageText.includes("not exist") ||
                messageText.includes("invalid model");

            if (!isModelAccessIssue) {
                throw normalizedError;
            }
        }
    }

    if (lastError instanceof Error) {
        throw lastError;
    }

    return unknownReply;
}
