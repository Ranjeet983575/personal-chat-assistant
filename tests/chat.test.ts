import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { env } from "../src/config/env.js";
import { extractReplyText, getModelCandidates } from "../src/assistant/reply.js";

describe("POST /api/chat", () => {
    it("answers greetings without requiring provider credentials", async () => {
        const response = await request(app)
            .post("/api/chat")
            .send({ message: "Ram Ram" });

        expect(response.status).toBe(200);
        expect(response.body.reply).toContain("Ram Ram!");
        expect(response.body.reply).toContain("Ranjeet's personal assistant");
    });

    it("rejects an empty message", async () => {
        const response = await request(app)
            .post("/api/chat")
            .send({ message: " " });

        expect(response.status).toBe(400);
    });

    it("uses the personal-assistant fallback when Groq is not configured", async () => {
        const response = await request(app)
            .post("/api/chat")
            .send({ message: "What is Ranjeet's favorite food?" });

        expect(response.status).toBe(200);
        expect(response.body.reply).toContain("Ranjeet will get back to you");
    });
});

describe("Groq reply handling", () => {
    it("prefers the configured model but falls back to a known-working Groq model", () => {
        expect(getModelCandidates("llama-3.1-8b-instant")).toEqual([
            "llama-3.1-8b-instant",
            "qwen/qwen3.8-27b",
            "allam-2-7b",
        ]);
    });

    it("extracts text from Groq responses that use array content blocks", () => {
        expect(
            extractReplyText({
                choices: [
                    {
                        message: {
                            content: [
                                { type: "text", text: "Hello!" },
                                { type: "text", text: " Welcome" },
                            ],
                        },
                    },
                ],
            }),
        ).toBe("Hello! Welcome");
    });
});

describe("API documentation", () => {
    it("serves the OpenAPI document", async () => {
        const response = await request(app).get("/openapi.json");

        expect(response.status).toBe(200);
        expect(response.body.paths["/api/chat"]).toBeDefined();
        expect(response.body.paths["/webhooks/whatsapp"]).toBeDefined();
    });

    it("serves the Swagger UI", async () => {
        const response = await request(app).get("/docs/");

        expect(response.status).toBe(200);
        expect(response.text).toContain("swagger-ui");
    });
});

describe("WhatsApp webhook verification", () => {
    it("returns the challenge for a matching verification token", async () => {
        const originalToken = env.WHATSAPP_VERIFY_TOKEN;
        env.WHATSAPP_VERIFY_TOKEN = "test-token";
        const response = await request(app).get("/webhooks/whatsapp").query({
            "hub.mode": "subscribe",
            "hub.verify_token": "test-token",
            "hub.challenge": "test-challenge",
        });
        env.WHATSAPP_VERIFY_TOKEN = originalToken;

        expect(response.status).toBe(200);
        expect(response.text).toBe("test-challenge");
    });

    it("rejects invalid verification tokens", async () => {
        const response = await request(app).get("/webhooks/whatsapp").query({
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong-token",
            "hub.challenge": "test-challenge",
        });

        expect(response.status).toBe(403);
    });
});
