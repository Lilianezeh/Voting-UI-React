# HackathonAfrica 3.0 — Head of House Voting System (React)

An "official ballot" themed voting UI for a Head of House election, built with React, TypeScript, and Tailwind CSS. A React rebuild of an earlier vanilla TypeScript/DOM version, reusing the same core voting logic.

## Features

- Search-to-select voter identification (type a name to filter the roll)
- Candidate selection via avatar cards (initials, color-coded)
- Confirmation dialog before a vote is recorded, with an ink-stamp animation on success
- Prevents a voter from voting more than once
- Live progress bar and vote count as votes come in
- Results stay sealed behind a lock icon until all votes are cast
- **Admin mode** — a password-gated control that lets an admin unlock and view results early, before all votes are in

## Tech Stack

- **React** + **TypeScript** — UI and application logic
- **Vite** — dev server and build tool
- **Tailwind CSS v4** — styling, using a custom `@theme` token system (colors, fonts) rather than the default Tailwind palette

## Project Structure

```
src/
  types.ts      # shared TypeScript interfaces (Voter, Candidate, VotingState, etc.)
  logic.ts       # pure voting logic — no DOM/React dependencies, fully reusable
  App.tsx        # main component: state, event handlers, JSX layout
  index.css      # Tailwind import + custom theme tokens + animations
  main.tsx       # Vite/React entry point
```

## Setup

```bash
bun install
```

## Run Locally

```bash
bun run dev
```

Opens at `http://localhost:5173` by default.

## How Voting Works

1. Search for and select your name under **Find your name**.
2. Pick a nominated candidate from the avatar grid under **Cast your vote**.
3. Click **Record Vote** — a confirmation dialog appears.
4. Confirm to cast your vote (a "VOTE RECORDED" stamp animation plays), or cancel to go back.
5. Progress and vote counts update live. Results stay sealed (🔒) until all votes are cast.

## Admin Mode

A small **🔒 Admin** button sits in the top-right corner. Clicking it opens a password prompt (with a show/hide toggle on the password field) — entering the correct password unlocks and displays results early, before all votes have been cast, with a visible "Admin view" badge so it's clear results are being shown ahead of schedule.

The current admin password is `1234` — change the `ADMIN_PASSWORD` constant near the top of `App.tsx` to update it.

> **Security note:**
> ```typescriptreact
> // NOTE: client-side only — not real security. Anyone reading the JS bundle
> // can find this. A real admin gate would verify a password against a server.
> ```
> This admin gate only hides/shows the results panel in the UI — it does not protect the underlying vote data from anyone inspecting the page's JavaScript. It's suitable for a demo or assignment context, but a production system would need the password (or a proper auth token) verified server-side before any results data is ever sent to the browser.

## Known Limitations

- **No persistence** — all state lives in memory. Refreshing the page resets every vote to zero.
- **No backend** — this is a fully client-side app; there's no server enforcing rules, storing votes, or securing admin access.
- **Not tamper-proof** — since all logic runs in the browser, a technically inclined voter could, in principle, alter the app's state directly via browser dev tools. This project is a UI/UX and frontend architecture exercise, not a secure voting system.
