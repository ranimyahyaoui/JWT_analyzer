require("dotenv").config();

const express=require('express');
const cors=require('cors');
import analyzeRouter from "./routes/analyze.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRouter);

app.get("/", (req, res) => {
  res.json({ name: "JWT Analyzer API", status: "running" });
});

app.listen(PORT, () => {
  console.log(`serveur running`);
});
