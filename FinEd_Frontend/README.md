# FinEd Frontend

React single-page application for the FinEd financial literacy platform.

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite 7** for dev server and bundling
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin
- **React Router 7** for client-side routing
- **Firebase** for authentication (email/password + Google) and Firestore
- **Framer Motion** for animations
- **Recharts** for charts in the expense tracker
- **Three.js / React Three Fiber** for 3D elements on the landing page
- **Lucide React** for icons

## Project Structure

```
src/
  main.jsx              # Entry point - renders <App />
  App.jsx               # Router with all route definitions
  LandingPage.jsx       # Public landing page
  FeaturePage.jsx       # Feature overview grid
  firebase.js           # Firebase initialisation (reads VITE_* env vars)
  index.css             # Global styles and Tailwind import
  FetchChatHistory.js   # Firestore chat-history helper
  FetchPosts.js         # Firestore community-posts helper
  fetchTracker.js       # Firestore expense-tracker helper

  components/
    Beams.jsx            # Animated background beams (Three.js)
    Brand.jsx            # Brand logo / name component
    InfoPageLayout.jsx   # Shared layout for static info pages
    RequireAuth.jsx      # Route guard - redirects unauthenticated users
    SimulatorGuide.jsx   # Reusable simulator onboarding guide
    SiteFooter.jsx       # Global footer
    SiteHeader.jsx       # Global header with nav
    ViewOnlyGate.jsx     # Allows viewing but gates interactions

  features/
    CreditOrLoan.jsx              # Simulator selection page
    CreditSimulator.jsx           # Credit card simulator
    CreditSimulatorWorking.jsx    # How credit simulation works (educational)
    LoanSimulator.jsx             # Loan/EMI simulator
    LoanSimulationWorking.jsx     # How loan simulation works (educational)
    StockSimulator.jsx            # Stock portfolio simulator
    FinChatbot.jsx                # AI chatbot (calls backend /api/chat)
    finNews.jsx                   # Finance news feed (calls backend /api/finnews)
    expense.jsx                   # Expense entry form
    savings.jsx                   # Savings goal tracker
    tracker.jsx                   # Expense tracker dashboard
    CommunityPage.jsx             # Discussion board
    SignUpPage.jsx                 # Login / signup page
    ScrollToTop.jsx                # Scroll-to-top on route change

  pages/
    AboutPage.jsx         # About FinEd
    ContactPage.jsx       # Contact form / info
    HelpCenterPage.jsx    # FAQ / help
    PrivacyPolicyPage.jsx # Privacy policy
    TermsPage.jsx         # Terms of service

public/
  faviconb.png          # Primary favicon
  favicon192.png        # PWA icon (192x192)
  favicon512.png        # PWA icon (512x512)
  vionix.jpg            # Vionix team logo
  manifest.json         # PWA web app manifest
```

## Routes

| Path | Component | Auth |
|---|---|---|
| `/` | LandingPage | Public |
| `/features` | FeaturePage | Public |
| `/creditOrLoan` | CreditOrLoan | Public |
| `/credit` | CreditSimulator | View-gated |
| `/credit!help` | CreditSimulatorWorking | Public |
| `/loan` | LoanSimulator | View-gated |
| `/loan!help` | LoanSimulationWorking | Public |
| `/chatbot` | FinChatbot | View-gated |
| `/news` | FinNews | Requires auth |
| `/stock` | StockSimulator | View-gated |
| `/tracker` | Tracker | View-gated |
| `/community` | CommunityPage | Public |
| `/login` | AuthPage (login) | Public |
| `/signup` | AuthPage (signup) | Public |
| `/about` | AboutPage | Public |
| `/contact` | ContactPage | Public |
| `/help` | HelpCenterPage | Public |
| `/privacy` | PrivacyPolicyPage | Public |
| `/terms` | TermsPage | Public |

**View-gated** means the page renders for everyone but interactive features (form submission, saving data) require sign-in.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE` | Yes | Backend URL, e.g. `http://localhost:8000` |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics measurement ID |

## Development

```bash
cp .env.example .env   # fill in values
npm install
npm run dev            # starts Vite dev server on http://localhost:5173
```

## Building for Production

```bash
npm run build          # outputs to dist/
npm run preview        # preview the production build locally
```

## Linting

```bash
npm run lint           # runs ESLint across all .js/.jsx files
```

## Deployment

The `dist/` folder after `npm run build` is a static site. Deploy it to any static host:

- **Vercel**: connect your repo and set the root to `FinEd_Frontend`
- **Netlify**: set build command to `npm run build` and publish directory to `dist`
- **Firebase Hosting**: `firebase deploy --only hosting` after configuring `firebase.json`

Add a `_redirects` file (Netlify) or equivalent rewrite rule to serve `index.html` for all routes, since this is a SPA with client-side routing.
