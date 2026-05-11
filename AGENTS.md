# AI Agent Instructions for Naija Career Hub

This file tracks custom project conventions, UI rules, and backend logic established for the Naija Career Hub application.

## Project Overview
Naija Career Hub is a specialized platform for Nigerian job seekers and students. It provides a curated list of jobs/scholarships and AI-powered tools for CV and Cover Letter generation.

## AI Content Generation Rules (Gemini API)
- **Market Context**: Every generated document (CV or Cover Letter) MUST be tailored for the Nigerian job market, using appropriate professional tones (e.g., "Yours faithfully/sincerely").
- **Clean Output**: AI models are instructed to output ONLY the document text. They MUST NOT include markdown code blocks (e.g., \`\`\`markdown\`) or backticks in the response.
- **No Placeholders**: AI MUST avoid generating boilerplate like "[Insert Phone Number]" or "(Replace with your experience)". If user data is missing, the AI should expand on the current inputs or leave them clean for final manual editing, rather than using generic brackets.
- **Tone Consistency**: For cover letters, respect the user's selected tone: 'Professional', 'Enthusiastic', or 'Confident'.

## UI/UX Guidelines
- **Template Previews**: The CV generator in `AITools.tsx` uses a real-time visual preview for the 'Modern', 'Traditional', and 'Creative' styles. Keep these visual representations updated if layout logic changes.
- **Markdown Handling**: The application uses \`react-markdown\` to render AI results. All AI results are sanitized in the frontend to strip any accidental markdown code wrappers.
- **Layout Precision**: The CV result display supports dynamic font sizes ('sm', 'base', 'lg') and line spacing ('tight', 'normal', 'relaxed'). Ensure any changes to the template preserve these controls.

## Deployment Conventions
- **GitHub Pages**: The project is configured for deployment to GitHub Pages.
  - **Vite Config**: \`base: './'\` is strictly required in \`vite.config.ts\` for assets to load correctly on relative paths.
  - **Deploy Script**: Use \`npm run deploy\` (powered by the \`gh-pages\` package) to push the \`dist\` folder to the repository's host branch.
