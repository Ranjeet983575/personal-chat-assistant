import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { openApiSpec } from "./docs/openapi.js";
import { errorHandler } from "./middleware/error-handler.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";
import { whatsappWebhookRouter } from "./routes/whatsapp-webhook.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(
  express.json({
    limit: "1mb",
    verify: (request, _response, body) => {
      (request as typeof request & { rawBody: Buffer }).rawBody =
        Buffer.from(body);
    },
  }),
);
app.use(pinoHttp({ level: env.LOG_LEVEL }));

app.use("/health", healthRouter);
app.use("/api", chatRouter);
app.use("/webhooks/whatsapp", whatsappWebhookRouter);
app.get("/openapi.json", (_request, response) => response.json(openApiSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use((_request, response) => {
  response.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);
