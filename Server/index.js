const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { loginToVTiger, getContacts } = require("./vtigerAPI");
require("dotenv").config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("📡 API backend for DataBank is running");
});

 app.post("/api/login", async (req, res) => {
  try {
    const sessionName = await loginToVTiger();
     res.json({ success: true, sessionName });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});


app.get("/api/contacts", async (req, res) => {
  try {
     let sessionName;
     sessionName = await loginToVTiger();
    const contacts = await getContacts(sessionName);
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});