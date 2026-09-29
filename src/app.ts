import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp({ level: env.LOG_LEVEL }));

app.use("/health", healthRouter);

app.use((_request, response) => {
    response.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);
