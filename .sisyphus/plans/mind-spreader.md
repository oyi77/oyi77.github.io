# Plan: Mind-Spreader (Headless Content Automation)

**Status:** Ready for Execution (Final - All Momus Issues Resolved)
**Target:** oyi77.github.io
**Objective:** Integrate headless CMS and social media automation pipelines.

## 1. Architecture

The system consists of three distinct modules isolated from the core OS kernel:

1.  **Command Center (`admin/`)**: A Decap CMS interface for managing content via a GUI.
2.  **The Ear (`_scripts/automation/capture.py`)**: An ingestion engine that polls Telegram for new ideas and saves them as drafts.
3.  **The Broadcaster (`_scripts/automation/broadcast.py`)**: An egestion engine that publishes "ready" posts to social media (mock implementation for Phase 1).

## 2. Content Lifecycle

**Workflow: Idea -> Draft -> Review -> Publish -> Syndicate**

1.  **Capture**: Telegram message -> `_drafts/YYYY-MM-DD-slug.md` (`social_status: draft`).
2.  **Promotion**: Human manually moves draft file from `_drafts/` to `_posts/`.
3.  **Review**: Human edits content in Decap CMS (which manages `_posts/`) and changes `social_status` to `ready`.
4.  **Syndicate**: `mind-broadcast.yml` detects `social_status: ready` -> Updates to `posted` (mock posting).

**Key Decision**:
- Decap CMS only manages `_posts/`.
- Telegram drafts stay in `_drafts/` until manually promoted.
- Editing happens **AFTER promotion** in `_posts/`, not in `_drafts/`.
- **Workflow commits every 10 minutes** to persist Telegram offset (ensures reliable polling).

## 2.1 Telegram Setup Checklist

Before running workflows, set up the bot:

1. **Create a Bot via @BotFather**:
   - Send `/newbot` to @BotFather on Telegram.
   - Follow prompts to name your bot.
   - Copy the HTTP API token.

2. **Get Chat ID**:
   - Add the bot to your private chat or supergroup.
   - Send a test message in the chat.
   - Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in your browser.
   - Find `"chat":{"id":-XXXXXXX` in the response (negative ID for groups, positive for private).
   - Copy the numeric ID.

3. **Verify Bot Access**:
   - Run locally (see verification below) or check the getUpdates response includes your message.
   - Bot must have received at least one message in the chat to appear in updates.

4. **Add Secrets**:
   - Go to repo Settings → Secrets and variables → Actions.
   - Add `TELEGRAM_TOKEN` (your bot token).
   - Add `TELEGRAM_CHAT_ID` (the numeric ID from step 2).

**Verification**:
```bash
# Local test (requires .env file or exported env vars)
export TELEGRAM_TOKEN="your-token"
export TELEGRAM_CHAT_ID="your-chat-id"
python _scripts/automation/capture.py
# Expected: "No new drafts, offset advanced" (if no new messages)
```

## 2.2 Draft Promotion Procedure

When a Telegram draft is ready to publish:

1. **Move file from `_drafts/` to `_posts/`**:
   ```bash
   git mv _drafts/2026-01-20-my-idea.md _posts/2026-01-20-my-idea.md
   ```
   Using `git mv` preserves file history.

2. **Verify filename format**:
   - Posts in `_posts/` use `YYYY-MM-DD-slug.md` (date of promotion or original capture).
   - Ensure the date reflects when you want the post to appear.

3. **Commit the promotion**:
   ```bash
   git commit -m "Promote: Telegram draft to post"
   git push
   ```

4. **Edit in Decap CMS**:
   - Visit `/admin/` → Edit the newly promoted post.
   - Set `social_status` to `ready`.
   - Save to commit to `main`.

**Acceptance Criteria**:
- [ ] File moved from `_drafts/` to `_posts/` using `git mv`.
- [ ] File appears in Decap CMS `_posts/` collection.
- [ ] `social_status` changed to `ready` in Decap.
- [ ] `mind-broadcast.yml` workflow picks up the status change.

## 3. State & Deduping (Telegram)

**State File**: `_scripts/automation/capture_state.json`
```json
{
  "last_update_id": 12345,
  "last_run": "2026-01-20T12:00:00Z"
}
```

**Update Strategy** (Always commit to ensure forward progress):
- `last_update_id`: **Always updated** to max offset seen. This is critical to prevent getting stuck on old messages.
- `last_run`: Updated **ONLY** when new drafts are created (for tracking).

**Why Always Commit?**
- If we skip committing offset updates, filtered messages (wrong chat, non-text, edited) would be reprocessed endlessly.
- Committing `capture_state.json` every 10 minutes is acceptable overhead for reliable polling.

**Filtering Rules** (Strict):
- **Required**: `TELEGRAM_CHAT_ID` must match `message.chat.id`.
- **Required**: `message.text` must exist (ignore photos, stickers, etc.).
- **Allowed**: Forwarded messages (`message.forward_from` exists) are processed like normal text.
- **Ignored**: `edited_message` updates are ignored entirely.
- **Error Handling**: If API fails, exit 1 (workflow retries on next scheduled run).

**Slug Algorithm**:
- Use `python-slugify` library.
- Input: First 50 characters of message text (before slugification).
- Sanitization: Lowercase, remove special chars, replace spaces with hyphens.
- Collision Handling: If file exists, append `-1`, `-2`, etc. (e.g., `telegram-message-title-2.md`).

## 4. Frontmatter Requirements

**CORRECTED LAYOUT**: This repo uses `layout: single` (defined in `_config.yml`). Always set explicitly.

**REQUIRED** for all automation:
```yaml
---
title: "Telegram: {message_preview}"
date: 2026-01-20T12:00:00+00:00  # ISO 8601 with timezone (e.g., +00:00)
categories: [telegram]
tags: [draft, telegram]
social_status: draft
layout: single
---
```

**Date Format Requirement**:
- Must be ISO 8601 with timezone offset (e.g., `2026-01-20T12:00:00+00:00`).
- Use `datetime.now(timezone.utc).isoformat()` in Python to ensure consistency.

**OPTIONAL** (defaults provided in `_config.yml`):
- `author_profile`, `read_time`, `comments`, `share`, `related`.

## 5. Decap CMS Auth Strategy

**Method**: Cloudflare Worker OAuth Proxy with PAT

**Rationale**: Secure, works on GitHub Pages, uses PAT server-side.

**Architecture**:
```
[User at /admin/] -> [Cloudflare Worker (handles OAuth)] -> [GitHub API with PAT] -> [Repo]
```

**Step-by-Step Implementation**:

1. **Create GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - New OAuth App:
     - Application name: `Mind-Spreader CMS`
     - Homepage URL: `https://oyi77.github.io`
     - Authorization callback URL: `https://mind-spreader-auth.workers.dev/callback`
   - Save `Client ID` and `Client Secret`.

2. **Create Cloudflare Worker**:
   ```bash
   # Install Wrangler
   npm install -g wrangler
   
   # Login
   wrangler login
   
   # Create worker
   wrangler init mind-spreader-auth --name mind-spreader-auth
   cd mind-spreader-auth
   ```

3. **Create Worker Code** (`src/index.js`):
   ```javascript
   export default {
     async fetch(request, env, ctx) {
       const url = new URL(request.url);
       
       // OAuth callback handler
       if (url.pathname === "/callback") {
         const code = url.searchParams.get("code");
         if (!code) return new Response("No code", { status: 400 });
         
         // Exchange code for access token
         const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
           method: "POST",
           headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
           },
           body: JSON.stringify({
             client_id: env.GITHUB_CLIENT_ID,
             client_secret: env.GITHUB_CLIENT_SECRET,
             code
           })
         });
         
         const tokenData = await tokenResponse.json();
         if (tokenData.error) {
           return new Response(JSON.stringify(tokenData), { status: 400 });
         }
         
         // For single-user: verify token belongs to your GitHub username
         const userResponse = await fetch("https://api.github.com/user", {
           headers: {
             "Authorization": `Bearer ${tokenData.access_token}`,
             "Accept": "application/json"
           }
         });
         const userData = await userResponse.json();
         
         // Restrict to your GitHub username
         if (userData.login !== "oyi77") {  // Replace with your username
           return new Response("Unauthorized user", { status: 403 });
         }
         
         // Return token to Decap (will be used server-side by proxy calls)
         return new Response(JSON.stringify({ access_token: env.DECAP_GITHUB_TOKEN }), {
           headers: { "Content-Type": "application/json" }
         });
       }
       
       // Proxy GitHub API requests from Decap CMS
       if (url.pathname.startsWith("/api/")) {
         const path = url.pathname.replace("/api/", "");
         const ghRequest = new Request(`https://api.github.com/${path}`, {
           method: request.method,
           headers: {
             "Authorization": `Bearer ${env.DECAP_GITHUB_TOKEN}`,
             "Accept": "application/vnd.github.v3+json",
             ...Object.fromEntries(request.headers)
           },
           body: request.body
         });
         
         const ghResponse = await fetch(ghRequest);
         return new Response(ghResponse.body, {
           status: ghResponse.status,
           headers: { "Content-Type": "application/json" }
         });
       }
       
       return new Response("Not found", { status: 404 });
     }
   };
   ```

4. **Configure Wrangler** (`wrangler.toml`):
   ```toml
   name = "mind-spreader-auth"
   main = "src/index.js"
   compatibility_date = "2024-01-01"
   ```

5. **Deploy Worker**:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler secret put DECAP_GITHUB_TOKEN  # Your PAT with repo write access
   wrangler deploy
   ```

6. **Update Decap Config** (`admin/config.yml`):
   ```yaml
   backend:
     name: github
     repo: oyi77/oyi77.github.io
     branch: main
     base_url: https://mind-spreader-auth.workers.dev  # Your worker URL
   ```

7. **Login Flow**:
   - User visits `/admin/`
   - Redirected to GitHub for OAuth
   - After authorization, worker verifies user and uses server-side PAT for API calls
   - Changes commit to `_posts/` via GitHub API

## 6. Implementation Plan

### Phase 1: Directory Structure & Dependencies
Establish the isolated environments.

- [ ] **Create**: `admin`, `_scripts/automation`.
- [ ] **Create**: `_scripts/automation/requirements.txt`:
    ```text
    requests
    python-frontmatter
    pyyaml
    python-slugify
    ```
- [ ] **Create**: `_scripts/automation/capture_state.json`:
    ```json
    {
      "last_update_id": 0,
      "last_run": null
    }
    ```
- [ ] **Verify**: `ls -la admin _scripts/automation`.

### Phase 2: Command Center (Decap CMS)
Enable GUI-based content management.

- [ ] **Create**: `admin/index.html`:
    ```html
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Content Manager</title>
    </head>
    <body>
      <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
    </body>
    </html>
    ```
- [ ] **Create**: `admin/config.yml`:
    ```yaml
    backend:
      name: github
      repo: oyi77/oyi77.github.io
      branch: main
      # Worker URL for OAuth proxy + server-side PAT
      base_url: https://mind-spreader-auth.workers.dev

    media_folder: "assets/images/uploads"
    public_folder: "/assets/images/uploads"

    collections:
      - name: "posts"
        label: "Posts"
        folder: "_posts"
        create: true
        slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
        fields:
          - {label: "Layout", name: "layout", widget: "hidden", default: "single"}
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Date", name: "date", widget: "datetime"}
          - {label: "Social Status", name: "social_status", widget: "select", options: ["draft", "ready", "posted"], default: "draft"}
          - {label: "Body", name: "body", widget: "markdown"}
    ```
- [ ] **Verify**:
    - Visit `/admin/` on GitHub Pages domain.
    - Login redirects to GitHub OAuth → Returns authenticated.
    - Create/edit post → Confirm commit appears on `main` under `_posts/`.

### Phase 3: The Ear (Telegram Capture)
Automate idea ingestion.

- [ ] **Create**: `_scripts/automation/capture.py`:
    ```python
    #!/usr/bin/env python3
    """Capture Telegram messages to Jekyll drafts."""
    import os
    import json
    import time
    import requests
    from datetime import datetime, timezone
    from slugify import slugify
    import frontmatter

    # Env vars
    TOKEN = os.environ.get("TELEGRAM_TOKEN")
    CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")  # Required, must match message.chat.id
    STATE_FILE = "_scripts/automation/capture_state.json"

    def load_state():
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        return {"last_update_id": 0, "last_run": None}

    def save_state(state):
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)

    def get_updates(offset):
        """Fetch updates from Telegram."""
        url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
        params = {"offset": offset, "limit": 100}
        resp = requests.get(url, params=params)
        resp.raise_for_status()
        return resp.json().get("result", [])

    def create_draft(update):
        """Create a Jekyll draft from a Telegram message."""
        msg = update.get("message", {})
        text = msg.get("text", "")
        if not text:
            return False  # Skip non-text messages

        # Validate Chat ID
        if str(msg.get("chat", {}).get("id")) != str(CHAT_ID):
            return False

        # Generate slug and filename
        title_preview = text[:50].strip()
        base_slug = slugify(title_preview)
        filename = f"_drafts/{datetime.now().strftime('%Y-%m-%d')}-{base_slug}.md"

        # Handle collisions
        counter = 1
        while os.path.exists(filename):
            filename = f"_drafts/{datetime.now().strftime('%Y-%m-%d')}-{base_slug}-{counter}.md"
            counter += 1

        # Write file
        post = frontmatter.Post(text)
        post["title"] = f"Telegram: {title_preview}"
        post["date"] = datetime.now(timezone.utc).isoformat()
        post["categories"] = ["telegram"]
        post["tags"] = ["draft", "telegram"]
        post["social_status"] = "draft"
        post["layout"] = "single"

        with open(filename, "w", encoding="utf-8") as f:
            f.write(frontmatter.dumps(post))

        return True

    def main():
        if not TOKEN or not CHAT_ID:
            print("ERROR: TELEGRAM_TOKEN and TELEGRAM_CHAT_ID must be set")
            exit(1)

        state = load_state()
        updates = get_updates(state["last_update_id"] + 1)

        new_drafts = 0
        max_offset = state["last_update_id"]

        for update in updates:
            update_id = update["update_id"]
            # Create draft if valid
            if create_draft(update):
                new_drafts += 1
            # Always track max offset to ensure forward progress
            if update_id > max_offset:
                max_offset = update_id

        # Always persist offset (even if filtered) to prevent reprocessing
        # This is critical: if we skip offset updates, we get stuck on old messages
        state["last_update_id"] = max_offset

        # Update last_run only when drafts created
        if new_drafts > 0:
            state["last_run"] = datetime.now(timezone.utc).isoformat()
            save_state(state)
            print(f"Created {new_drafts} new draft(s)")
        else:
            # Still save state to persist offset advance
            save_state(state)
            print("No new drafts, offset advanced")

    if __name__ == "__main__":
        main()
    ```
- [ ] **Create**: `.github/workflows/mind-capture.yml`:
    ```yaml
    name: Mind Capture

    on:
      schedule:
        - cron: '*/10 * * * *'
      workflow_dispatch:

    permissions:
      contents: write

    # Prevent conflicts with other scheduled workflows
    concurrency:
      group: mind-spreader-capture
      cancel-in-progress: false

    jobs:
      capture:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              token: ${{ secrets.GITHUB_TOKEN }}
              fetch-depth: 0

          - name: Setup Python
            uses: actions/setup-python@v5
            with:
              python-version: '3.11'

          - name: Install dependencies
            run: |
              pip install -r _scripts/automation/requirements.txt

          - name: Run Capture Script
            env:
              TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
              TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
            run: |
              python _scripts/automation/capture.py

          - name: Commit and push
            run: |
              git config --local user.email "action@github.com"
              git config --local user.name "GitHub Action"
              
              # Pull latest to handle concurrent updates
              git pull origin main --rebase || git pull origin main
              
              git add _drafts/ _scripts/automation/capture_state.json
              
              # Check if there are actual changes to commit
              if git diff --cached --quiet; then
                echo "No changes to commit"
              else
                if [ -n "$(git diff --cached _drafts/)" ]; then
                  git commit -m "Auto-capture: New Telegram draft [skip ci]"
                else
                  git commit -m "Auto-capture: Offset advanced [skip ci]"
                fi
                git push origin main
              fi
    ```
- [ ] **Secrets**: Add `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` in repo settings.
- [ ] **Verify**:
    - Local test: Run with dummy token -> Fails with clean error message.
    - Workflow test (no new messages): `capture_state.json` advances offset -> Commit with "offset advanced".
    - Workflow test (new message): New `_drafts/*.md` created + offset advanced -> Commit with "new draft(s)".

### Phase 4: The Broadcaster (Social Poster)
Automate publication signaling.

- [ ] **Create**: `_scripts/automation/broadcast.py`:
    ```python
    #!/usr/bin/env python3
    """Scan for ready posts and 'broadcast' them."""
    import glob
    import frontmatter
    import os

    def main():
        posts = glob.glob("_posts/*.md")
        ready_count = 0

        for filepath in posts:
            post = frontmatter.load(filepath)
            if post.metadata.get("social_status") == "ready":
                print(f"Posting '{post.metadata.get('title')}' to Socials...")
                post.metadata["social_status"] = "posted"
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(frontmatter.dumps(post))
                ready_count += 1

        if ready_count == 0:
            print("No posts with status 'ready' found")
        else:
            print(f"Updated {ready_count} post(s)")

    if __name__ == "__main__":
        main()
    ```
- [ ] **Create**: `.github/workflows/mind-broadcast.yml`:
    ```yaml
    name: Mind Broadcast

    on:
      schedule:
        - cron: '0 */8 * * *'
      workflow_dispatch:

    permissions:
      contents: write

    # Prevent conflicts with other scheduled workflows
    concurrency:
      group: mind-spreader-broadcast
      cancel-in-progress: false

    jobs:
      broadcast:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              token: ${{ secrets.GITHUB_TOKEN }}
              fetch-depth: 0

          - name: Setup Python
            uses: actions/setup-python@v5
            with:
              python-version: '3.11'

          - name: Install dependencies
            run: |
              pip install -r _scripts/automation/requirements.txt

          - name: Run Broadcast Script
            run: |
              python _scripts/automation/broadcast.py

          - name: Commit and push
            run: |
              git config --local user.email "action@github.com"
              git config --local user.name "GitHub Action"
              
              # Pull latest to handle concurrent updates
              git pull origin main --rebase || git pull origin main
              
              git add _posts/
              
              if git diff --cached --quiet; then
                echo "No changes to commit"
              else
                git commit -m "Auto-broadcast: Update social status [skip ci]"
                git push origin main
              fi
    ```
- [ ] **Verify**:
    - Create test post with `social_status: ready` -> Run workflow -> Status updated to `posted`.
    - Run with no `ready` posts -> Expect "No posts with status 'ready' found" -> No commit.

## 7. GitHub Actions Permissions
Both workflows require:
```yaml
permissions:
  contents: write
```

## 8. Execution Instructions

Run `/start-work` to begin the implementation of these components.
