# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ |
| Older branches | ❌ |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please email **a6hinandh@gmail.com** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Any suggested fix (optional)

You will receive an acknowledgement within **48 hours** and a resolution timeline within **7 days**.

## Scope

In scope:
- Authentication bypass or privilege escalation
- Injection vulnerabilities (SQL, command, XSS, etc.)
- Exposure of sensitive user data
- API key or secret leakage via server responses
- Firebase security rule misconfigurations

Out of scope:
- Denial-of-service (rate limiting is handled at the infra level)
- Social engineering
- Vulnerabilities in third-party services (Firebase, Gemini API, Marketaux)

## Security Practices in This Project

- All secrets are stored in `.env` files that are gitignored and never committed
- Firebase credentials on the frontend use environment variables (`VITE_*`) injected at build time
- The backend validates and sanitises all user input before passing it to external APIs
- CORS is configured on the Express server
- No user financial data is stored — the app is educational only
