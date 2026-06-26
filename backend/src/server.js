import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import analyzeRouter from "./routes/analyze.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors ({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRouter);

app.get("/", (req, res) => {
  res.json({ name: "JWT Analyzer API", status: "running" });
});

app.listen(PORT, () => {
  console.log(`serveur running`);
});
