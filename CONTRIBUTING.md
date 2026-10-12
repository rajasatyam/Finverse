# Contributing to FinEd

Thank you for your interest in contributing to FinEd! This document explains how to get involved.

## Getting Started

1. **Fork** this repository and clone your fork.
2. Create a new branch from `main`:
   ```bash
   
   git checkout -b feature/your-feature-name
   ```
3. Set up both the frontend and backend by following the instructions in the root [README](README.md).

## Development Workflow

1. Make your changes in a feature branch.
2. Test your changes locally (run both the frontend dev server and backend).
3. Ensure the frontend builds without errors:
   ```bash
   cd FinEd_Frontend && npm run build
   ```
4. Run the linter:
   ```bash
   cd FinEd_Frontend && npm run lint
   ```
5. Commit with a clear, descriptive message (see below).
6. Push your branch and open a pull request against `main`.

## Commit Messages

Use clear, imperative-mood commit messages:

```
Add credit score breakdown to loan simulator
Fix chatbot crash when Gemini API returns empty response
Update news endpoint to handle pagination
```

## Pull Request Guidelines

- Keep PRs focused on a single change. Avoid bundling unrelated fixes.
- Describe **what** changed and **why** in the PR description.
- Include screenshots for UI changes.
- Make sure existing functionality is not broken.

## Code Style

- **Frontend**: React functional components with hooks. Follow the existing ESLint configuration.
- **Backend**: ES module syntax (`import`/`export`). Keep `server.js` as the single entry point.
- Use `const` by default; use `let` only when reassignment is necessary.
- Prefer descriptive variable and function names over comments.

## Project Structure

```
FinEd_Frontend/   # React + Vite + Tailwind CSS
FinEd_Backend/    # Node.js + Express API
```

Each sub-project has its own `package.json`, dependencies, and README with more detail.

## Reporting Bugs

Open a [GitHub issue](../../issues) with:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser / Node.js version
5. Screenshots if applicable

## Suggesting Features

Open a [GitHub issue](../../issues) with the `enhancement` label. Describe:

1. The problem your feature would solve
2. Your proposed solution
3. Any alternatives you considered

## Security Issues

Do **not** open a public issue for security vulnerabilities. Follow the process in [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the same [CC BY-NC 4.0](LICENSE) license as the rest of the project.
