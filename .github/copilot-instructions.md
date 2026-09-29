# Project Guidance

- Use TypeScript with strict compiler settings and ES modules.
- Keep HTTP routing, configuration, and future provider integrations in separate modules.
- Validate all external input and environment variables at the boundary.
- Never commit secrets; add new required environment variables to `.env.example` with safe placeholder values.
- Add focused tests for behavior changes and run `npm test`, `npm run lint`, and `npm run build` before completing a change.
- Do not select WhatsApp, LLM, or vector database providers until the project requirements specify them.
