# Personal Chat Assistant

Personal messaging assistant for Ranjeet Kumar Prajapati, built with Node.js, Express, and TypeScript. It uses Groq for profile-aware chat replies and supports incoming messages through the WhatsApp Cloud API webhook. Greetings are answered without an LLM request.

## Requirements

- Node.js 22 or newer
- npm

## Local setup

```sh
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:3000` by default. Swagger UI is available at `http://localhost:3000/docs`, with the raw OpenAPI document at `/openapi.json`.

## API

- `GET /health` checks service status.
- `POST /api/chat` accepts `{"message":"Tell me about your Kafka experience"}` and returns `{"reply":"..."}`.
- `GET /webhooks/whatsapp` handles Meta webhook verification.
- `POST /webhooks/whatsapp` validates signed Meta events and replies to incoming text messages.

If Groq is not configured or a reply cannot be generated, the assistant returns its configured personal-assistant fallback rather than disclosing provider errors.

## Commands

- `npm run dev` starts the development server with reload.
- `npm run build` compiles TypeScript into `dist/`.
- `npm start` runs the compiled server.
- `npm test` runs the test suite.
- `npm run lint` checks source and test files.
- `npm run format:check` checks formatting.

## Configuration

The real `.env` file belongs in the repository root and is ignored by Git, including dotenv variants such as `.env.local`. Never commit credentials. `.env.example` contains blank safe placeholders and is the only environment file intended for source control. Environment variables are validated at startup.

- `GROQ_API_KEY` is the Groq API key; `GROQ_MODEL` selects the Groq model.
- `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are used to send replies.
- `WHATSAPP_VERIFY_TOKEN` is the secret value configured in Meta webhook setup.
- `WHATSAPP_APP_SECRET` enables `X-Hub-Signature-256` verification for incoming events. Set it in production.
- `WHATSAPP_API_VERSION` selects the Meta Graph API version.

## Planned integration boundaries

The supplied professional profile is the assistant's current response context. RAG ingestion/retrieval is not implemented yet; the current assistant answers from that profile and the selected Groq model.
