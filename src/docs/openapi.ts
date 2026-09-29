export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Personal Chat Assistant API",
    version: "1.0.0",
    description:
      "Profile-aware chat replies using Groq and an inbound WhatsApp Cloud API webhook.",
  },
  servers: [{ url: "/", description: "Current server" }],
  paths: {
    "/health": {
      get: {
        summary: "Check API health",
        responses: { "200": { description: "API is healthy" } },
      },
    },
    "/api/chat": {
      post: {
        summary: "Generate a personal-assistant reply",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string", minLength: 1, maxLength: 4000 },
                },
              },
              example: { message: "Tell me about your experience with Kafka" },
            },
          },
        },
        responses: {
          "200": {
            description: "Assistant reply",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reply"],
                  properties: { reply: { type: "string" } },
                },
              },
            },
          },
          "400": { description: "Invalid message" },
        },
      },
    },
    "/webhooks/whatsapp": {
      get: {
        summary: "Verify the WhatsApp webhook",
        parameters: [
          { in: "query", name: "hub.mode", schema: { type: "string" } },
          { in: "query", name: "hub.verify_token", schema: { type: "string" } },
          { in: "query", name: "hub.challenge", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Webhook verified; returns challenge" },
          "403": { description: "Verification failed" },
        },
      },
      post: {
        summary: "Receive WhatsApp messages",
        description:
          "Validates Meta's X-Hub-Signature-256 when WHATSAPP_APP_SECRET is configured.",
        responses: {
          "200": { description: "Webhook event accepted" },
          "400": { description: "Invalid event" },
          "401": { description: "Invalid webhook signature" },
        },
      },
    },
  },
} as const;
