 const express = require("express");
const cors = require("cors");
require("dotenv").config();
const contactRoutes = require('./routes/contacts');  
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

 app.get("/", (req, res) => {
  res.send("📡 API backend for DataBank is running");
});

 app.use('/api/contacts', contactRoutes);  

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

 const express = require('express');
const router = express.Router();
const { loginToVTiger, getContacts } = require('../vtigerAPI');

router.get('/', async (req, res) => {  
  try {
      const sessionName = await loginToVTiger();
      const contacts = await getContacts(sessionName);
      res.json({ success: true, contacts });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message || err});
  }
});

module.exports = router;
