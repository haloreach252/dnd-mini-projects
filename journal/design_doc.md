# 📖 Lore and Journal System – Project Plan

## 📌 Overview

The Lore and Journal System is a single-page React application for storing, organizing, and viewing narrative entries related to a DnD campaign or world. It supports player journals, GM-only notes, tagging, filtering, and markdown formatting. Designed to be local-first using PostgreSQL and fully compatible with future Supabase migration.

---

## ✅ Tech Stack

| Category         | Tool/Library              | Notes |
|------------------|---------------------------|-------|
| Frontend         | React 19                  | Built with Vite + React 19 |
| UI Framework     | TailwindCSS + ShadCN UI   | Consistent, modern design |
| Editor           | react-markdown            | Lightweight, React 19 compatible, actively maintained |
| State Management | Zustand                   | Simple global state management |
| Validation       | Zod                       | Form validation and schema safety |
| Backend          | Node.js + Koa             | Lightweight API server |
| DB Layer         | PostgreSQL + Prisma ORM   | Local-first, Supabase-ready |
| Markdown Parser  | remark / rehype plugins   | Optional extended markdown support |

---

## 🧱 Core Features

### 1. Create/Edit Entries
- Title
- Content (Markdown-enabled textarea)
- Tags (freeform, comma-separated or pill-style input)
- Visibility toggle: GM Only or Player Visible
- CreatedBy (optional for now)

### 2. View Entries
- Rendered using `react-markdown` with optional plugins
- Metadata: author, timestamps, visibility status
- Expand/collapse previews

### 3. Filter/Sort/Search
- Filter by:
  - Tags
  - Visibility
  - Creator (optional)
- Sort by:
  - Newest / Oldest
  - A-Z
- Full-text search by title and content (PostgreSQL)

### 4. Persistent Storage
- Entries stored in PostgreSQL via Prisma
- Compatible with future Supabase migration

---

## 🧪 Development Phases

### Phase 1: Foundation
- Set up PostgreSQL, Prisma, and Koa backend
- Create API routes for journal entry CRUD operations

### Phase 2: Frontend Core
- Build the Markdown editor and viewer
- Create the entry list and individual entry UI

### Phase 3: Tagging & Filtering
- Add tagging system and visibility filters
- Implement search and sort functionality

### Phase 4: UX Polish
- Auto-save drafts to Zustand or localStorage
- Add loading/error handling
- Ensure mobile and accessibility support

---

## 🔮 Stretch Goals (Post-MVP)
- Export to Markdown or PDF
- AI-powered summarization
- Real-time collaboration (WebSockets)
- Link entries to characters, locations, or sessions
- Supabase sync and authentication
