# HackathonAfrica 3.0 — Head of House Voting System (React)

An "official ballot" themed voting UI for a Head of House election, built with React, TypeScript, Tailwind CSS, and TanStack Query.

## Features

- Search-to-select voter identification (type a name to filter the roll)
- Candidate selection via avatar cards (initials, color-coded)
- Confirmation dialog before a vote is recorded, with a green ink-stamp animation on success
- Prevents a voter from voting more than once
- Live progress bar and vote count as votes come in
- Results stay sealed until all votes are cast — a message lets voters know results will be reviewed once voting is complete
- **Admin mode** — a password-gated control that lets an admin unlock and view results early, before all votes are in, and reset the election
- Votes persist across page reloads (stored in the browser via `localStorage`, managed through TanStack Query)

## Tech Stack

- **React** + **TypeScript** — UI and application logic
- **Vite** — dev server and build tool
- **Tailwind CSS v4** — styling, using a custom `@theme` token system (colors, fonts) rather than the default Tailwind palette
- **TanStack Query** (`@tanstack/react-query`) — manages fetching, caching, and updating the voting data, instead of holding it directly in local component state

## Project Structure

```
index.html               # Vite's HTML entry point — loads Google Fonts (Space Grotesk, Inter, JetBrains Mono)
src/
  types.ts                # shared TypeScript interfaces (Voter, Candidate, VotingState, etc.)
  logic.ts                 # pure voting logic — no DOM/React/data-fetching dependencies
  api.ts                    # data layer — reads/writes voting state via localStorage, wrapped in
                              async functions so TanStack Query can manage it like real API calls
  constants.ts               # voter names, candidate names, avatar colors, admin password
  utils.ts                    # small helpers (avatar color lookup, initials)
  App.tsx                      # top-level component: TanStack Query hooks, event handlers,
                                  wires all the components below together
  components/
    Header.tsx                  # title, member count, votes-cast progress bar
    VoterSearch.tsx               # search-to-select voter identification
    VotingCard.tsx                 # candidate avatar grid + Record Vote button
    ResultsPanel.tsx                # sealed/unsealed results, admin tools (reset votes)
    VoteDialog.tsx                   # confirm-vote modal + stamp animation
    AdminDialog.tsx                   # admin password prompt with show/hide toggle
  index.css                          # Tailwind import + custom theme tokens + animations
  main.tsx                            # Vite/React entry point — sets up the TanStack Query provider
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
4. Confirm to cast your vote (a green "VOTE RECORDED" stamp animation plays), or cancel to go back.
5. Progress and vote counts update live. Results stay sealed until all votes are cast, or until an admin unlocks them early.

## Component Structure

`App.tsx` holds all the actual state (voting data, current selections, admin status) and passes it down to smaller components as props — each component below only knows about the specific piece of data and callbacks it needs, not the whole app's state:

- **`Header`** — purely presentational; just displays numbers passed in as props
- **`VoterSearch`** — manages its own search-text state internally, and only tells `App.tsx` about a selection once a name is actually clicked (via an `onSelect` callback)
- **`VotingCard`** — renders the candidate grid and Record Vote button
- **`ResultsPanel`** — decides whether to show the sealed message or the live tally, and renders the admin toolbar when applicable
- **`VoteDialog`** / **`AdminDialog`** — the two `<dialog>` modals. Both use `forwardRef` so `App.tsx` can still call `.showModal()` / `.close()` on them directly, since dialogs are controlled imperatively rather than through props alone

One small trick worth knowing: `VoterSearch` is given `key={votesCast}` in `App.tsx`. Changing a component's `key` tells React to treat it as a brand new instance, which resets its internal state — this is how the search box automatically clears itself after every successful vote, without `App.tsx` needing to manage that internal state directly.

## Data Layer — Why TanStack Query

The voting data used to live directly in a `useState` inside `App.tsx`. It's now managed through **TanStack Query** instead:

- `useQuery` fetches the current voting state (from `api.ts`, which reads `localStorage`) and exposes `isLoading` / `isError` states while it does
- `useMutation` handles casting a vote and resetting the election, exposing an `isPending` state (shown as "Recording…" / "Resetting…" on the relevant buttons) while the update is in progress
- After a successful mutation, `queryClient.setQueryData(...)` updates the cached voting state so the UI reflects the change immediately

There's no real backend here — `api.ts` still just reads and writes `localStorage` under the hood — but wrapping it in `async` functions lets TanStack Query manage it exactly the way it would manage a real network request, which is what this project uses it to demonstrate.

## Admin Mode

A small **🔒 Admin** button sits in the top-right corner. Clicking it opens a password prompt (with a show/hide toggle on the password field) — entering the correct password unlocks and displays results early, before all votes have been cast, with a visible "Admin view" badge so it's clear results are being shown ahead of schedule. Admin mode also exposes a **Reset votes** button, which clears all recorded votes back to zero.

The current admin password is `1234` — change the `ADMIN_PASSWORD` constant in `src/constants.ts` to update it.

> **Security note:**
> ```typescriptreact
> // NOTE: client-side only — not real security. Anyone reading the JS bundle
> // can find this. A real admin gate would verify a password against a server.
> ```
> This admin gate only hides/shows the results panel in the UI — it does not protect the underlying vote data from anyone inspecting the page's JavaScript. It's suitable for a demo or assignment context, but a production system would need the password (or a proper auth token) verified server-side before any results data is ever sent to the browser.

## Fonts

Fonts (Space Grotesk, Inter, JetBrains Mono) are loaded via `<link>` tags in `index.html`'s `<head>`, rather than a CSS `@import` — this lets the browser start downloading them as soon as it parses the page, in parallel with everything else, instead of waiting for the CSS file to load first.

## Known Limitations

- **No real backend** — `api.ts` simulates a data-fetching layer over `localStorage`; there's no server enforcing rules, storing votes centrally, or securing admin access.
- **No cross-device sync** — since data lives in the browser's `localStorage`, votes cast on one device/browser won't appear on another. A real deployment would need a server + database for that.
- **Not tamper-proof** — since all logic runs in the browser, a technically inclined voter could, in principle, alter the app's state directly via browser dev tools. This project is a UI/UX and frontend architecture exercise, not a secure voting system.
