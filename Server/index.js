 const express = require('express');
const app = express();

 app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.get('/', (req, res) => {
  res.send('Bonjour, monde!');
});

 const port = 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});