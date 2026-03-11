# CLAUDE.md — AI Assistant Guide for appsmith_1

This file provides context for AI coding assistants (Claude, Cursor, Copilot, etc.) working on this repository. Read it before making changes.

---

## Project Overview

**appsmith_1** is a visitor management application built on [Appsmith](https://www.appsmith.com/), a low-code/no-code platform. It is designed to be showcased as a portfolio project for recruiters and hiring managers.

**Core purpose:** Manage visitor sign-ins via RFID keyfob scanning, book space reservations, maintain contact profiles, and provide administrative oversight — all from a browser-based dashboard.

**Live demo:** https://app.appsmith.com/applications/652449ce5012274cbc5158f5/pages/652449cf5012274cbc5158fe

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Appsmith UI widgets (drag-and-drop, declarative JSON) |
| App logic | JavaScript (ES6+, async/await) in Appsmith JS Objects |
| Database queries | SQL via Appsmith query editor |
| Backend / DB | Supabase (PostgreSQL + REST API + Storage) |
| File storage | Supabase Storage (S3-compatible, buckets: `images/avatars`, `images/posts`) |
| Auth | PIN-based, client-side only |
| External libs | Supabase JS client, jsPDF, imageCompression, i18next, MQTT, xmlParser |

---

## Repository Structure

```
appsmith_1/
├── application.json          # App-level metadata (pages list, theme reference)
├── metadata.json             # Schema version (clientSchemaVersion, serverSchemaVersion)
├── theme.json                # UI theme (colors, fonts, border radius)
├── datasources/
│   └── supabase.json         # Supabase PostgreSQL datasource config
├── jslibs/                   # External JS libraries loaded by Appsmith
│   ├── supabase_*.json
│   ├── jspdf_*.json
│   ├── imageCompression_*.json
│   ├── i18next_*.json
│   ├── mqtt_*.json
│   └── xmlParser_*.json
├── pages/
│   ├── Home/                 # Main dashboard — RFID scan, reservations, contact form
│   │   ├── Home.json         # Page config (widgets list, jsobjects list, queries list)
│   │   ├── jsobjects/        # JS utility modules (see table below)
│   │   ├── queries/          # SQL + JS queries run against Supabase
│   │   └── widgets/          # UI component JSON definitions
│   ├── Contacts/             # Contact management, reservation history
│   ├── Admin/                # Admin panel — visit cleanup, photo deletion
│   └── Page1/                # Login / access control
├── scripts/
│   ├── supabase-local-start.sh           # Start local Supabase stack
│   ├── supabase-local-psql.sh            # Open psql to local DB
│   └── supabase-local-restore-backup.sh  # Restore a downloaded backup locally
├── diagram.svg               # Architecture diagram
├── README.md                 # Public-facing project description
└── CLAUDE.md                 # This file
```

---

## Pages

| Page | Purpose |
|------|---------|
| **Home** | Primary workflow: RFID scan → visitor lookup → reservation booking → photo upload |
| **Contacts** | CRUD for contact profiles; view reservation history per contact |
| **Admin** | Monitor visits/reservations; delete old visit records; purge stale photos |
| **Page1** | PIN-entry login gate |

---

## JS Object Modules (Home page)

All business logic lives in JavaScript Object modules inside `pages/Home/jsobjects/`. Each module exports an object with async methods.

| Module | File | Key Functions |
|--------|------|---------------|
| `js_utils_rfid` | `js_utils_rfid.js` | `handle_visitor()`, `lookup_visitor()`, `check_reservations()`, `hexToDecimal()` |
| `js_utils_reset` | `js_utils_reset.js` | `reset_store()`, `reset_on_load()`, `refresh_app()`, `reset_widgets()` |
| `js_utils_contact` | `js_utils_contact.js` | `upsert()` — create or update a contact record |
| `js_utils_reservation` | `js_utils_reservation.js` | `upsert()`, `filter_spaces()`, `get_space()` |
| `js_utils_image` | `js_utils_image.js` | `upload()`, `upload_reservation()`, `retrieve()`, `retrieve_reservation()` |
| `js_utils_supabase_toggle` | `js_utils_supabase_toggle.js` | `enable(url, key)`, `disable()`, `status()` — runtime Supabase toggle |
| `js_utils_datetime` | `js_utils_datetime.js` | `getTimePeriod()`, `isTimeInRange()` |
| `js_utils_input` | `js_utils_input.js` | `handle_tbl()`, `remove_row()` |
| `js_utils_delete_photos` | `js_utils_delete_photos.js` | `delete_photos()`, `get_older_than()` |
| `js_utils_credits` | `js_utils_credits.js` | `get()` — fetch reservations for current shift |
| `js_utils_contact_key` | `js_utils_contact_key.js` | WIP — key update logic |

---

## Global Store (Appsmith `storeValue` / `appsmith.store`)

The app uses Appsmith's global store as shared state. Key store keys:

| Key | Type | Description |
|-----|------|-------------|
| `supabaseUrl` | string | Supabase project URL (empty in demo mode) |
| `supabaseKey` | string | Supabase anon public key (empty in demo mode) |
| `demo_mode` | boolean | `true` = no network calls; `false` = live Supabase |
| `keys_contacts` | object | Currently scanned visitor's merged key+contact+visit record |
| `reservations_dict` | object | Current reservation being built |
| `photo` | string | Base64 or URL for contact avatar |
| `photo_url` | string | Uploaded avatar public URL |
| `photo_reservation` | string | Uploaded reservation photo URL |
| `time_period` | object | `{date, period, day, start, end}` for current shift |
| `space_id/uuid/name` | mixed | Selected space for reservation |
| `user_profiles` | array | Username/password pairs for PIN auth |
| `pin` | string | Access PIN |
| `resetCounter` | number | Increments on each full app reset |

---

## Database Schema (Supabase PostgreSQL)

Tables accessed via SQL queries and Supabase JS client:

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `contacts` | `id`, `uuid`, `name`, `dob`, `email`, `phone`, `credits`, `is_active`, `photo_url` | Visitor profiles |
| `keys_contacts` | join of `keys` + `contacts` | Associates RFID keys to contacts |
| `visits` | `id`, `uuid`, `contact_uuid`, `key_id`, `created_at` | Visit log per scan |
| `reservations` | `id`, `uuid`, `contact_uuid`, `key_uuid`, `space_uuid`, `date`, `period`, `start`, `end`, `status`, `amount`, `photo_url` | Booking records |
| `spaces` | `id`, `uuid`, `name`, `number`, `category` | Available reservable spaces |
| `files` | `filepath`, `created_at` | Photo metadata for age-based cleanup |

**Storage buckets:**
- `images/avatars/` — contact profile photos (named `{contact_uuid}.png`)
- `images/posts/` — reservation photos (named `{visit_uuid}.png`)
- Photos older than 7 days are auto-deleted via `js_utils_delete_photos`

---

## Demo Mode (Default — No Backend Required)

The repo ships in **demo mode** by default. No Supabase credentials are stored in code.

### How it works

- `reset_store_static` in `js_utils_reset.js` sets `supabaseUrl: ''`, `supabaseKey: ''`, `demo_mode: true`
- Every function that calls Supabase checks `appsmith.store.demo_mode` first and short-circuits with safe placeholder data
- A red banner ("Demo Mode: Backend disabled") appears on all pages when `demo_mode` is `true`

### Enabling live Supabase at runtime

Call `js_utils_supabase_toggle.enable()` from the Appsmith JS console or a button action:

```js
// Connect to your own Supabase project
js_utils_supabase_toggle.enable('https://YOUR-PROJECT.supabase.co', 'YOUR-ANON-KEY')

// Check status
js_utils_supabase_toggle.status()

// Revert to demo mode
js_utils_supabase_toggle.disable()
```

### Local Supabase development

```bash
# Start local Supabase stack (requires Supabase CLI)
./scripts/supabase-local-start.sh

# Restore a downloaded backup
./scripts/supabase-local-restore-backup.sh /path/to/db_cluster.backup 15.6.1.115

# Open psql shell
./scripts/supabase-local-psql.sh

# Then point the app to local:
js_utils_supabase_toggle.enable('http://localhost:54321', 'anon-or-service-role-key')
```

See [Supabase local development docs](https://supabase.com/docs/guides/local-development/restoring-downloaded-backup) for full setup.

---

## Development Conventions

### File formats

- **All configuration is declarative JSON.** Pages, widgets, and queries are JSON files synced from Appsmith via Git Sync.
- **JS logic lives in `.js` files** inside `pages/*/jsobjects/*/` — these are plain ES6 module exports.
- **Do not modify widget JSON files manually** unless you know exactly what Appsmith fields you're changing. Incorrect JSON will cause Appsmith to fail to load the page.
- **`metadata.json`** in each jsobject folder declares the variable bindings for module-level properties.

### Query files

Each query in `pages/*/queries/*/` has:
- A `.json` file with the SQL or JS body and parameter bindings
- A `metadata.json` with the query's ID and datasource reference

### Naming conventions

| Item | Convention |
|------|-----------|
| JS Object modules | `js_utils_<domain>` (snake_case) |
| Widget names | `<type>_<purpose>` e.g. `input_key_rfid`, `tbl_reservations` |
| Store keys | `snake_case` |
| Query names | `sel_*` (SELECT), `upsert_*`, `update_*`, `insert_*`, `del_*` |
| Widget IDs | Short unique strings in JSON (do not change manually) |

### Making JS changes

1. Edit the `.js` file in the relevant `jsobjects/` subfolder.
2. If you add a new module-level variable, also update the `variables` array in `metadata.json`.
3. Test in the live Appsmith editor; changes propagate on save.
4. Commit both the `.js` and `metadata.json` files together.

### Adding a new JS Object module

1. Create `pages/Home/jsobjects/<module_name>/` directory.
2. Create `<module_name>.js` with `export default { ... }`.
3. Create `metadata.json` with the module's `id`, `name`, `pageId`, `pluginId: "js-plugin"`, and `variables: []`.
4. Register the module in `pages/Home/Home.json` under `unpublishedCollection`.

### Supabase credential policy

**Never commit Supabase URLs or API keys to this repository.** The app is intended for public visibility (recruiter portfolio). All Supabase access must go through the runtime toggle (`js_utils_supabase_toggle.enable()`).

---

## Key Workflows

### RFID Scan Flow

```
input_key_rfid (hex input)
  → js_utils_rfid.handle_visitor()
    → hexToDecimal(hex)
    → lookup_visitor(decimal_key)   // queries keys_contacts view
    → check_reservations()          // queries reservations table
    → showAlert() with status
  → User fills contact form + selects space/time
  → js_utils_image.upload()         // optional photo
  → js_utils_reservation.upsert()   // create reservation
  → js_utils_reset.refresh_app()    // reset for next scan
```

### App Initialization

```
Page1 (login) → PIN verified → navigate to Home
  → js_utils_reset.reset_on_load()
    → clearStore()
    → reset_store(dynamic keys)
    → reset_store()  // static defaults (demo_mode=true, empty creds)
    → sel_visits_reservations.run()
```

### Photo Upload Flow (when Supabase is enabled)

```
camera widget captures photo (base64)
  → js_utils_image.upload(base64, fileName)
    → if demo_mode: store placeholder URL, call js_utils_contact.upsert()
    → else: upload to Supabase Storage (images/avatars/<uuid>.png)
           → retrieve public URL
           → js_utils_contact.upsert() with photo_url
```

---

## Common Tasks for AI Assistants

### Fix a broken Supabase query

1. Check if `appsmith.store.demo_mode` guard is present at the top of the function.
2. Ensure credentials are read from `appsmith.store.supabaseUrl` / `appsmith.store.supabaseKey`, never hardcoded.
3. Pattern to follow:
```js
if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
  return safeDefaultValue;
}
const supabaseUrl = appsmith.store.supabaseUrl;
const supabaseKey = appsmith.store.supabaseKey;
// ... use new supabase.SupabaseClient(supabaseUrl, supabaseKey) ...
```

### Add sample/mock data for demo mode

Add mock return data inside the demo_mode guard block. Keep it realistic enough to demonstrate the UI (e.g., a fake contact, a fake reservation).

### Add a new page

1. Create `pages/<PageName>/` with `<PageName>.json`, `jsobjects/`, `queries/`, `widgets/`.
2. Register the page in `application.json` under `pages`.
3. Follow existing page JSON structure exactly (copy from an existing page and adapt).

### Update the README for recruiters

Edit `README.md`. Keep it friendly and showcase: the tech stack, what problem it solves, live demo link, and how to explore the code.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` / `master` | Stable, deployable state |
| `claude/*` | AI-assisted feature branches |
| `cursor/*` | Cursor AI feature branches |

Always develop on a feature branch and open a PR to `main`.

---

## Security Notes

- **PIN auth is client-side only** — suitable for low-security internal tools, not production auth.
- **Supabase anon key** is a public key by design (row-level security enforced on the DB side). However, do not commit the actual URL+key pair to Git.
- **No secrets in code.** Use `js_utils_supabase_toggle.enable()` at runtime for live connections.

---

## Recruiter / Portfolio Notes

This repository is intentionally structured for public visibility:
- All hardcoded backend credentials have been removed
- Demo mode allows the app to be opened and explored without any backend
- The live Appsmith demo is publicly accessible (link above)
- The `diagram.svg` shows the architecture at a glance
- Source code demonstrates: async JavaScript patterns, SQL query design, Supabase Storage integration, Appsmith platform expertise, and UI/UX workflow thinking
