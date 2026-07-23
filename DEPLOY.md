# Deploying Fikretak

This deploys as a **single Render web service**: the Express server serves both
the REST API and the built React app (same origin, so no CORS). The database
runs on **MongoDB Atlas** and image uploads go to **Cloudinary**.

```
Browser ──> Render web service ──> MongoDB Atlas
              (Express + React)  └─> Cloudinary (images)
```

The repo supports **two hosts**: Vercel (serverless, no card — see below) and
Render (single service — see the Render section). Both use the same Atlas +
Cloudinary setup from steps 1–3.

---

## Deploy to Vercel (card-free)

The React app is served statically and the Express API runs as a serverless
function (`api/index.js` → `backend/app.js`), wired up by `vercel.json`.

1. Do steps 1–3 below (Atlas, Cloudinary, JWT secret).
2. https://vercel.com → sign up with **GitHub** (no card on the Hobby plan).
3. **Add New… → Project** → import `Beshoy21/Fikretak`. Framework preset:
   **Vite** (auto-detected). Leave build settings as-is — `vercel.json` handles them.
4. Expand **Environment Variables** and add the same 5 secrets listed in the
   Render table (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`).
5. **Deploy.** When done, open the URL → the app loads and `…/api/health`
   returns `{ "status": "ok" }`.

> Notes: Atlas Network Access must allow `0.0.0.0/0`. Uploads are capped at 4 MB
> (Vercel's serverless body limit); images are stored on Cloudinary.

---

## 1. MongoDB Atlas (database) — you do this

1. Create a free account at https://www.mongodb.com/cloud/atlas and create a
   free **M0** cluster.
2. **Database Access →** create a database user (username + password).
3. **Network Access →** add IP `0.0.0.0/0` (allow from anywhere — Render's IPs
   are dynamic on the free plan).
4. **Connect → Drivers →** copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/fikretak?retryWrites=true&w=majority`
   Put your real password in, and keep `/fikretak` as the database name.
   → this is your **`MONGO_URI`**.

## 2. Cloudinary (image uploads) — you do this

1. Create a free account at https://cloudinary.com.
2. On the dashboard, copy **Cloud name**, **API Key**, and **API Secret**.
   → these are **`CLOUDINARY_CLOUD_NAME`**, **`CLOUDINARY_API_KEY`**,
   **`CLOUDINARY_API_SECRET`**.

## 3. Generate a JWT secret

Run locally and copy the output → **`JWT_SECRET`**:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 4. Push the code

```bash
git push -u origin audit/critical-fixes
# then merge to main, or deploy the branch directly
```

## 5. Render (hosting) — you do this

1. Create an account at https://render.com and connect your GitHub repo.
2. **New → Blueprint** and pick this repo. Render reads `render.yaml` and
   creates the `fikretak` web service automatically.
   (Or **New → Web Service** manually with:
   Build `npm install && npm run build && npm install --prefix backend`,
   Start `node backend/index.js`.)
3. In the service's **Environment** tab, add these variables:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | your Atlas connection string (step 1) |
   | `JWT_SECRET` | the secret from step 3 |
   | `CLOUDINARY_CLOUD_NAME` | from Cloudinary (step 2) |
   | `CLOUDINARY_API_KEY` | from Cloudinary |
   | `CLOUDINARY_API_SECRET` | from Cloudinary |

   (`NODE_ENV`, `JWT_EXPIRES_IN`, and `PORT` are handled by `render.yaml`/Render.)
4. Deploy. When it's live, open `https://<your-app>.onrender.com` — the React
   app loads, and `…/api/health` returns `{ "status": "ok" }`.

## 6. (Optional) Seed sample data

From your machine, pointing at the production DB:
```bash
cd backend
MONGO_URI="<your Atlas URI>" npm run seed   # WARNING: wipes users + ideas
```

---

## Notes
- **Never commit `.env`** — it's git-ignored. All secrets live in Render's
  Environment tab.
- **Free-tier cold starts:** Render free services sleep after inactivity; the
  first request can take ~30–60s to wake.
- **Local dev** still works unchanged: leave the Cloudinary vars blank and
  uploads fall back to local disk (`backend/uploads`).
- **Custom domain / HTTPS:** Render provides HTTPS automatically; add a custom
  domain in the service settings if you want one.
