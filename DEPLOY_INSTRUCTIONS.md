# Cyber Hax v5 Deploy Instructions

## 1. Public Render-hosted game

The main playable browser build now lives in `web/` and is intended to be served by the same FastAPI service that runs the multiplayer API and websocket backend.

Public URL:
- `https://cyber-hax-server.onrender.com`

Backend assumptions:
- HTTP API base: `https://cyber-hax-server.onrender.com`
- WebSocket base: `wss://cyber-hax-server.onrender.com`

Why this setup matters:
- the game page, API, and websocket service all come from the same Render app
- this reduces cross-origin issues for public play
- invite links can point directly to the same public host

## 2. Files served from FastAPI

FastAPI serves the public game from the `web/` folder.

Important files:
- `web/index.html`
- `web/app.js`
- `web/styles.css`
- `web/main_music.ogg`
- `web/favicon.svg`

Public routing intent:
- `GET /` -> main playable game page
- `GET /play?session=ROOMCODE` -> same playable page with room info
- `GET /styles.css` -> CSS
- `GET /app.js` -> browser client JS
- `GET /main_music.ogg` -> audio
- `GET /favicon.svg` -> icon
- existing `GET /api/...` routes remain active
- existing `/ws/{session_id}` websocket route remains active

Implementation notes:
- root-level assets are served from the same `web/` directory
- API and websocket routes are defined before the catch-all public static mount so multiplayer behavior is preserved

## 3. How the public web game behaves

The public Render build is configured to:
- use relative asset references in `web/index.html`
- default to `wss://cyber-hax-server.onrender.com`
- call `https://cyber-hax-server.onrender.com/api/rooms/new` for room creation
- gracefully fall back to manual room code entry if create-room fails
- preserve chat, room controls, command deck, map, modals, audio, reconnect handling, and invites

## 4. Push and redeploy on Render

From the repo root:

```powershell
cd D:\Projects\Cyber\Cyber-Hax-v5
git add .
git commit -m "Prepare public Render build and landing site"
git push origin main
```

Then in Render:
1. Open your service dashboard
2. Select the `cyber-hax-server` service
3. Trigger `Manual Deploy` or let auto-deploy run from `main`
4. Wait for the deploy to finish

Expected start command:

```text
uvicorn server_main:app --host 0.0.0.0 --port $PORT
```

## 5. How to test the game publicly

After Render finishes deploying:
1. Open `https://cyber-hax-server.onrender.com`
2. Click `Create Room`
3. Confirm a room code appears
4. Open the shared link in a second browser or device
5. Join with a different callsign
6. Confirm chat, movement, commands, logs, and rematch still work

Recommended quick checks:
- `https://cyber-hax-server.onrender.com/health`
- `https://cyber-hax-server.onrender.com/api/test`
- `https://cyber-hax-server.onrender.com/api/rooms/new`

## 6. Landing site deployment on Netlify

The separate static marketing site lives in `landing_site/`.

Files:
- `landing_site/index.html`
- `landing_site/styles.css`
- `landing_site/script.js`
- `landing_site/privacy.html`

### Netlify deploy

Option A: drag-and-drop
1. Zip the contents of `landing_site/`
2. Log in to Netlify
3. Create a new site from the folder or ZIP

Option B: Git-based
1. Push `landing_site/` to your repo
2. Create a new Netlify site from Git
3. Set the publish directory to `landing_site`
4. Deploy

## 7. Landing site deployment on GitHub Pages

1. Push the project to GitHub
2. Create a branch or repo for the marketing site if you want to keep it isolated
3. In GitHub Pages settings, publish the `landing_site` directory via your preferred Pages workflow
4. Make sure the published files are the contents of `landing_site/`, not a parent folder

## 8. Where to paste Google AdSense later

Prepared placeholders already exist in `landing_site/index.html`:

### In the head
Search for:

```html
<!-- AdSense / site verification scripts can be added here later. -->
```

### In the body
Search for:

```html
<!-- Future AdSense body ad unit can be inserted in this area or between major sections. -->
```

Do not insert fake AdSense code. Add your real account script and ad units only after the site is finalized.

## 9. How to help Google discover the project

### Public Render game

The Render-hosted game now includes:
- `web/robots.txt`
- `web/sitemap.xml`
- indexable meta tags in `web/index.html`

After redeploying Render, test:
- `https://cyber-hax-server.onrender.com/robots.txt`
- `https://cyber-hax-server.onrender.com/sitemap.xml`

### Landing site

The landing site now includes:
- `landing_site/robots.txt`
- `landing_site/sitemap.xml`
- canonical/meta tags in `landing_site/index.html`
- a privacy page and FAQ content for better indexing quality

Landing-site domain currently configured as:
- `https://cyber-hax.netlify.app`

### Google Search Console steps

Once the public site is live:
1. Open Google Search Console
2. Add your site property
3. Verify ownership
4. Submit your sitemap URL
5. Use URL inspection on the homepage and privacy page
6. Request indexing

## 10. Why the landing site is better for ads than the playable game

A separate landing site is better for ads because:
- it is easier to keep clean, readable, and content-rich for review
- it can host About, FAQ, screenshots, privacy, and contact information
- ads in a live multiplayer game UI would compete with gameplay clarity and trust
- the public game page should stay fast and low-friction

## 11. Assumptions made

Current assumptions:
- the main public playable URL remains `https://cyber-hax-server.onrender.com`
- Render continues to host both the FastAPI backend and the public game page
- the `web/` folder is the canonical public browser build
- the `landing_site/` folder is a separate static marketing site
- no account system is required for the first public release

## 12. Remaining server-side issues

Still unresolved or worth improving later:
- room/session state is still memory-backed, so a Render restart clears active rooms
- Render cold starts may briefly delay room creation after inactivity
- there is still no persistent user system or leaderboard backend
- if you later use a custom landing-site domain, update the CORS origin regex if that domain needs direct API access

## 13. Local testing notes

To run locally:

```powershell
cd D:\Projects\Cyber\Cyber-Hax-v5
python -m pip install -r requirements.txt
uvicorn server_main:app --host 0.0.0.0 --port 8000 --reload
```

Then open:

```text
http://127.0.0.1:8000
```
