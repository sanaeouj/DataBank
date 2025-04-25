const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'company_db',
  password: process.env.DB_PASSWORD || 'Eanas900811@',
  port: process.env.DB_PORT || 5432,
});

app.use(express.json());
app.use(cors());

app.get('/api/ressources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personaldetails'); 
    res.status(200).json(result.rows); 
  } catch (err) {
    console.error('Erreur lors de la récupération des données :', err.message);
    res.status(500).send('Erreur serveur lors de la récupération des données.');
  }
});

app.get('/api/ressources/all', async (req, res) => {
  try {
     const personalDetails = await pool.query('SELECT * FROM personaldetails');
    const companyDetails = await pool.query('SELECT * FROM companydetails');
    const geoLocalisation = await pool.query('SELECT * FROM geolocalisation');  
    const companyRevenue = await pool.query('SELECT * FROM companyrevenue');
    const socialDetails = await pool.query('SELECT * FROM socialdetails');

     const combinedData = personalDetails.rows.map((personal) => {
       const company = companyDetails.rows.find(c => c.personalid === personal.personalid);
      const geo = geoLocalisation.rows.find(g => g.companyid === (company ? company.companyid : null));  
      const revenue = companyRevenue.rows.find(r => r.companyid === (company ? company.companyid : null));  
      const social = socialDetails.rows.find(s => s.companyid === (company ? company.companyid : null));  

       return {
        ...personal,
        company: company ? { ...company } : {},
        geo: geo ? { ...geo } : {},
        revenue: revenue ? { ...revenue } : {},
        social: social ? { ...social } : {},
      };
    });

 
     res.status(200).json(combinedData);
  } catch (err) {
    console.error('Error retrieving data:', err.message);
    res.status(500).send('Server error while retrieving data.');
  }
});

app.post('/api/ressources', async (req, res) => {
  const { champ1, champ2 } = req.body; 
  
  if (!champ1 || !champ2) {
    return res.status(400).send('Les champs champ1 et champ2 sont requis.');
  }

  try {
    const result = await pool.query(
      'INSERT INTO votre_table (champ1, champ2) VALUES ($1, $2) RETURNING *',
      [champ1, champ2]
    );
    res.status(201).json(result.rows[0]); 
  } catch (err) {
    console.error('Erreur lors de l\'insertion des données :', err.message);
    res.status(500).send('Erreur serveur lors de  l\'insertion des données.');
  }
});

app.listen(port, () => {
  console.log(`Serveur écoutant sur http://localhost:${port}`);
});