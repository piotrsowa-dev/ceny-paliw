import express from "express";
import dotenv from "dotenv";
import { startCrons, runNow } from "./cron.js";
import { read } from "./storage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS dla Reacta lokalnie
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint — React to wywołuje
app.get("/api/ceny", (req, res) => {
  const data = read();
  res.json(data);
});

// Health check
app.get("/", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, async () => {
  console.log(`[SERVER] Działa na http://localhost:${PORT}`);
  startCrons();

  // Odkomentuj żeby pobrać dane od razu przy starcie (do testów)
  await runNow();
});