import express from "express";
import { db } from "./db.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  const row = db.prepare("SELECT 1 AS ok").get();
  res.json({ status: "ok", db: row ? "connected" : "unavailable" });
});

app.listen(port, () => {
  console.log(`prelegal backend listening on http://localhost:${port}`);
});
