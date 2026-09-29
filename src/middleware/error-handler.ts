import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  void _next;
  const message = error instanceof Error ? error.message : "Unknown error";
  response.status(500).json({ error: "Internal Server Error", message });
};
