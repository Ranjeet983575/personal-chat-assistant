# Personal Chat Assistant

Backend foundation for a personal WhatsApp chat assistant. The API is built with Node.js, Express, and TypeScript. WhatsApp, LLM, and RAG integrations will be added after their requirements and providers are decided.

## Requirements

- Node.js 22 or newer
- npm

## Local setup

```sh
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:3000` by default. Check `GET /health` for the service status.

## Commands

- `npm run dev` starts the development server with reload.
- `npm run build` compiles TypeScript into `dist/`.
- `npm start` runs the compiled server.
- `npm test` runs the test suite.
- `npm run lint` checks source and test files.
- `npm run format:check` checks formatting.

## Configuration

Copy `.env.example` to `.env` for local configuration. Environment variables are validated at startup.

## Planned integration boundaries

Provider-specific WhatsApp webhook handling, LLM clients, and document retrieval are intentionally not implemented yet. Choose those based on the upcoming requirements rather than embedding a provider assumption in the foundation.
