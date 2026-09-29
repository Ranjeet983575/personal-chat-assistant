import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type Request } from "express";
import { z } from "zod";
import { getGreetingReply } from "../assistant/greetings.js";
import { generateReply } from "../assistant/reply.js";
import { unknownReply } from "../assistant/profile.js";
import { env } from "../config/env.js";
import { sendWhatsAppTextMessage } from "../services/whatsapp.js";

const webhookSchema = z.object({
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z
              .array(
                z.object({
                  from: z.string().min(1),
                  type: z.string(),
                  text: z.object({ body: z.string() }).optional(),
                }),
              )
              .optional(),
          }),
        }),
      ),
    }),
  ),
});

type RawBodyRequest = Request & { rawBody?: Buffer };

function hasValidSignature(request: RawBodyRequest): boolean {
  if (!env.WHATSAPP_APP_SECRET) {
    return env.NODE_ENV !== "production";
  }

  const signature = request.header("x-hub-signature-256");
  if (!signature?.startsWith("sha256=") || !request.rawBody) {
    return false;
  }

  const expected = createHmac("sha256", env.WHATSAPP_APP_SECRET)
    .update(request.rawBody)
    .digest();

  let received: Buffer;
  try {
    received = Buffer.from(signature.slice("sha256=".length), "hex");
  } catch {
    return false;
  }

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

export const whatsappWebhookRouter = Router();

whatsappWebhookRouter.get("/", (request, response) => {
  const mode = request.query["hub.mode"];
  const token = request.query["hub.verify_token"];
  const challenge = request.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    typeof token === "string" &&
    token === env.WHATSAPP_VERIFY_TOKEN &&
    typeof challenge === "string"
  ) {
    response.status(200).type("text/plain").send(challenge);
    return;
  }

  response.sendStatus(403);
});

whatsappWebhookRouter.post("/", async (request, response) => {
  if (!hasValidSignature(request as RawBodyRequest)) {
    response.sendStatus(401);
    return;
  }

  const event = webhookSchema.safeParse(request.body);
  if (!event.success) {
    response.sendStatus(400);
    return;
  }

  response.sendStatus(200);

  for (const entry of event.data.entry) {
    for (const change of entry.changes) {
      for (const message of change.value.messages ?? []) {
        if (message.type !== "text" || !message.text?.body.trim()) {
          continue;
        }

        const reply =
          getGreetingReply(message.text.body) ??
          (await generateReply(message.text.body).catch(() => unknownReply));
        await sendWhatsAppTextMessage(message.from, reply).catch(
          () => undefined,
        );
      }
    }
  }
});
