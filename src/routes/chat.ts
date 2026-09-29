import { Router } from "express";
import { z } from "zod";
import { getGreetingReply } from "../assistant/greetings.js";
import { generateReply } from "../assistant/reply.js";
import { unknownReply } from "../assistant/profile.js";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

export const chatRouter = Router();

chatRouter.post("/chat", async (request, response) => {
  const input = chatRequestSchema.safeParse(request.body);
  if (!input.success) {
    response.status(400).json({
      error: "message must be a non-empty string up to 4000 characters",
    });
    return;
  }

  const greetingReply = getGreetingReply(input.data.message);
  if (greetingReply) {
    response.status(200).json({ reply: greetingReply });
    return;
  }

  try {
    response
      .status(200)
      .json({ reply: await generateReply(input.data.message) });
  } catch {
    response.status(200).json({ reply: unknownReply });
  }
});
