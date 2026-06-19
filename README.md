# personal-kanban-board
This project will act as a React knowledge refresher. Over the past 15 years I have previously worked commercially with Backbone, Angular, React and Vue. React has moved on massively since I last used it circa 2020.

# Rules for this project
- The aim of this project isn't just to deliver a working deliverable, it's to retrain and modernise my React knowledge.
- Write as much code as I can manually at the start, only using ai assistance for research, planning and some lite-boilerplate initially.
- Try not to overuse ai assistance for coding until my React knowledge is more refreshed.
- Retrain in the basics of a modern enterprise stack.
- Keep the stack small at the start, and introduce Zustand, Tanstack and other tech as I proceed.

---

# Tech stack

## Core
- [x] react
- [x] next

## UI
- [x] Fontawesome (icons)
- [x] Shadcn UI (components)
- [x] Tailwind (css)

NOTE:
- [] Motion (animation) - only add this if needed, initially focus on native and tailwind animation functions. prevents needing 'use client' and merging the server-client boundary

## State
- [] Zustand
- [] Tanstack

## Testing
- [] vitest
- [] Playwright

---

# Milestones
- Aiming to have a clear chronology of manual coding vs ai coding for when I'm more comfortable with the React stack.
- Transparency is key, I want to be able to show what milestones were reached with manual coding vs ai assisted.

## Milestone Commits
- [tbc]

---

# Project history
- June 18th
    - DONE - decide on tech stack.
    - DONE - update macos, homebrew, xcode, docker.
    - DONE - initialise react core of the project (Vite scaffold, since migrated)
    - DONE - migrate to Next.js (App Router, TypeScript, src/app/)
    - DONE (manual) create a sub page
    - DONE (ai) create a button to move between pages
    - DONE (ai) create a global breadcrumb component

---

# Gotchas and tips
- when scaffolding into an existing folder, use `.` as the project name
    - `npx create-next-app@latest . --typescript --app --src-dir --no-tailwind`