// Vercel serverless entry point (ESM — the root package.json is type: module).
// Imports the CommonJS Express app (default export = module.exports) and hands
// it to Vercel as the handler. The /api/(.*) rewrite in vercel.json routes all
// API requests here; Express routes from the original URL.
import app from '../backend/app.js';

export default app;
