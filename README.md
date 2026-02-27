# library-agent

A Botpress Agent built with the ADK. Includes a React/Vite frontend using the Botpress Webchat SDK.

## Running the Agent

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start the development server:

   ```bash
   bun run dev
   ```

   or

   ```bash
   adk dev
   ```

   The ADK dev console will be available at `http://localhost:3001`.

3. Build and deploy:
   ```bash
   bun run build   # compile
   bun run deploy  # deploy to Botpress Cloud
   ```

## Running the Frontend

The frontend is a React + Vite app using the Botpress Webchat SDK.

1. Install dependencies:

   ```bash
   cd frontend
   bun install
   ```

2. Start the dev server:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:5173` by default.

> The frontend connects to your agent via the `VITE_CLIENT_ID` in `frontend/.env`.
> Run both the agent and frontend simultaneously (in separate terminals).
> You can find the clientID in the Bots workspace on botpress under Webchat -> Features -> Advanced Settings

## Project Structure

- `agent.config.ts` — Agent name, models, state schemas, integrations
- `src/conversations/` — Message handlers (main user interaction logic)
- `src/knowledge/` — Knowledge bases for RAG
- `src/actions/` — Reusable business logic
- `src/workflows/` — Long-running / scheduled processes
- `src/tables/` — Data storage schemas
- `src/triggers/` — Event subscriptions
- `frontend/` — React + Vite webchat frontend

## Learn More

- [ADK Documentation](https://botpress.com/docs/adk)
- [Botpress Platform](https://botpress.com)
