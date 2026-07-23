const mongoose = require('mongoose');

// Cache the connection across serverless invocations (and hot reloads) so we
// don't open a new MongoDB connection on every request/cold start.
let cached = global.__fikretakMongo;
if (!cached) cached = global.__fikretakMongo = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
