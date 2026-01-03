const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Optional: connect to PostgreSQL if needed
const pool = require("./db");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================== AJAX LAB ROUTES ==================

// POST /api/hello
app.post("/api/hello", (req, res) => {
  res.send("Hello");
});

// POST /api/add
app.post("/api/add", (req, res) => {
  const { num1 } = req.body;
  res.send((Number(num1) + 20).toString());
});

// POST /api/get1 (async demo)
app.post("/api/get1", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  res.send("get1");
});

// POST /api/get2 (async demo)
app.post("/api/get2", (req, res) => {
  res.send("get2");
});

// ================== START SERVER ==================
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
