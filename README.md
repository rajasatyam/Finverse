# FinEd — Financial Literacy Platform

> Empowering young adults to understand and take control of their finances.

FinEd is a full-stack web application built by **Vionix** that combines interactive simulators, an AI-powered financial chatbot, real-time news, and community tools — all designed to make financial education accessible and engaging.

---

## Repository Structure

```
FinEd/
├── FinEd_Frontend/    # React + Vite + Tailwind CSS frontend
├── FinEd_Backend/     # Node.js + Express API backend
├── CONTRIBUTING.md    # Contribution guidelines
├── CODE_OF_CONDUCT.md # Contributor Covenant
├── SECURITY.md        # Vulnerability disclosure policy
└── LICENSE            # CC BY-NC 4.0
```

## Features

| Feature | Description |
|---|---|
| **AI Chatbot** | Gemini-powered financial literacy assistant with advisory modes |
| **Credit Simulator** | Simulate credit card usage and understand interest accumulation |
| **Loan Simulator** | Model EMI schedules and total repayment costs |
| **Stock Simulator** | Practice portfolio decisions without real money |
| **Expense Tracker** | Track income and spending with visual breakdowns |
| **Finance News** | Real-time news with AI-generated insights and sentiment analysis |
| **Community** | Discussion board for peer financial learning |
| **Auth** | Firebase-backed email/password and Google Sign-In |

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))
- A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/app/apikey))
- Optional: Marketaux and/or NewsAPI keys for the news feature

### 1. Clone

```bash
git clone https://github.com/a6hinandh/FinEd.git
cd FinEd
```

### 2. Backend setup

```bash
cd FinEd_Backend
cp .env.example .env       # fill in your API keys
npm install
npm start
```

The API server starts on `http://localhost:8000`.

### 3. Frontend setup

```bash
cd FinEd_Frontend
cp .env.example .env       # fill in your Firebase config and backend URL
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`.

## Tech Stack

**Frontend**
- React 19, React Router 7
- Vite 7, Tailwind CSS 4
- Framer Motion, Recharts, Three.js / React Three Fiber
- Firebase (Auth + Firestore)

**Backend**
- Node.js, Express 4
- Google Generative AI (Gemini 3.1 Flash Lite)
- Axios, dotenv, cors

## Environment Variables

See [`FinEd_Backend/.env.example`](FinEd_Backend/.env.example) and [`FinEd_Frontend/.env.example`](FinEd_Frontend/.env.example).

**Never commit `.env` files.** They are gitignored at both the root and sub-folder level.

## Documentation

- [Frontend README](FinEd_Frontend/README.md) — component architecture, routing, and deployment
- [Backend README](FinEd_Backend/README.md) — API reference and configuration

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Found a vulnerability? See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating you agree to abide by its terms.

## License

[CC BY-NC 4.0](LICENSE) — free to share and adapt for non-commercial use with attribution.
