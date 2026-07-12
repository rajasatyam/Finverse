# FinEd Backend

Node.js + Express API server powering the FinEd financial literacy platform.

## Tech Stack

- **Node.js** (>= 18) with ES modules
- **Express 4** for HTTP routing
- **Google Generative AI** (Gemini 3.1 Flash Lite) for chatbot, news insights, sentiment analysis, and definitions
- **Axios** for external API calls (Marketaux, NewsAPI, FreeDictionary)
- **dotenv** for environment variable management
- **cors** for cross-origin request handling

## Architecture

```
server.js              # Single-file Express server with all routes
.env.example           # Template for required environment variables
package.json           # Dependencies and scripts
```

The server is intentionally kept as a single file. It provides AI-powered financial education endpoints and proxies/enriches data from external news APIs.

### Key Design Decisions

- **In-memory caching**: Definition and insight results are cached in `Map` objects to avoid redundant Gemini calls within a single server lifecycle.
- **Dual news source**: Marketaux is the primary news provider; NewsAPI is the automatic fallback.
- **Fallback responses**: The `/api/chat` endpoint returns hardcoded educational tips when Gemini is unavailable, so the frontend never shows a raw error.
- **Advisory modes**: The chatbot supports four modes (`general`, `investment`, `planning`, `debt`) that shape the system prompt sent to Gemini.

## API Reference

### `POST /api/chat`

AI-powered financial literacy chatbot.

**Request body:**
```json
{
  "message": "What is a mutual fund?",
  "mode": "general"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `message` | string | (required) | User's question |
| `mode` | string | `"general"` | Advisory mode: `general`, `investment`, `planning`, `debt` |

**Response:** `{ response, mode, timestamp }`

---

### `GET /api/finnews`

Financial news with AI-generated insights and sentiment analysis.

| Query param | Default | Description |
|---|---|---|
| `q` | `"finance"` | Search query |
| `pageSize` | `10` | Results per page (max 50) |
| `category` | `"all"` | Filter by category |
| `entities` | `""` | Filter by financial entities |
| `sentiment_filter` | `"all"` | Filter: `positive`, `negative`, `neutral`, `all` |

**Response:** `{ news[], total, query, filters, provider, timestamp }`

---

### `POST /api/finnews/search`

Advanced news search with filter object.

**Request body:**
```json
{
  "query": "cryptocurrency",
  "filters": { "category": "crypto", "sentiment": "positive" },
  "pageSize": 10
}
```

---

### `GET /api/dictionary/:term`

Financial term definitions. Tries FreeDictionary API first, falls back to Gemini.

**Response:** `{ term, definition, cached, timestamp }`

---

### `GET /api/categories`

Returns available news categories with metadata.

---

### `GET /api/entities`

Returns popular financial entities (stocks, crypto, indices, Indian stocks).

---

### `GET /api/analytics/sentiment`

Market sentiment analytics (mock data).

| Query param | Default | Description |
|---|---|---|
| `days` | `7` | Analysis period |

---

### `GET /api/tips/:mode?`

Returns financial tips for the given advisory mode.

---

### `GET /api/modes`

Returns metadata for all advisory modes.

---

### `GET /api/health`

Health check with external service status.

**Response:** `{ status, service, timestamp, version, features, services }`

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `MARKETAUX_API_KEY` | Yes | Marketaux API key (primary news source) |
| `NEWS_API_KEY` | No | NewsAPI key (fallback news source) |
| `PORT` | No | Server port (default: `8000`) |
| `BASE_URL` | No | Internal base URL for self-calls (default: `http://localhost:PORT`) |

## Development

```bash
cp .env.example .env   # fill in API keys
npm install
npm run dev            # starts server with --watch for auto-reload
```

## Production

```bash
npm start              # runs node server.js
```

For production deployments, use a process manager like PM2 or deploy to a platform like Railway, Render, or Fly.io.

### Recommended Production Setup

- Set `NODE_ENV=production`
- Use a reverse proxy (nginx) in front of Express
- Configure rate limiting (not included — add `express-rate-limit` if needed)
- Set CORS origin to your frontend domain instead of the permissive default
