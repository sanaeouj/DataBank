const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT  ;

// Configuration de la base de données
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Headers de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Middleware CORS et JSON
// Middleware CORS et JSON
app.use(cors({
  origin: [
    'https://databank-f.onrender.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 app.use(express.json());

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ROUTES

// Récupérer toutes les personnes
app.get('/api/ressources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personaldetails');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
  }
});

// Récupérer toutes les entreprises
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT "company", "Email", "Phone", "employees", "industry", "SEO Description" FROM companyDetails');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
  }
});

// Récupérer toutes les ressources combinées
// ...autres routes...

// Récupérer toutes les ressources combinées
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
        company: company ? { 
          companyid: company.companyid,
          company: company.company || "",
          Email: company.Email || "",
          Phone: company.Phone || "",
          employees: company.employees || null,
          industry: company.industry || "",
          "SEO Description": company["SEO Description"] || "",
          personalid: company.personalid
        } : {
          companyid: null,
          company: "",
          Email: "",
          Phone: "",
          employees: null,
          industry: "",
          "SEO Description": "",
          personalid: personal.personalid
        },
        geo: geo ? {
          city: geo.city || "",
          address: geo.address || "",
          state: geo.state || "",
          country: geo.country || ""
        } : {
          city: "",
          address: "",
          state: "",
          country: ""
        },
        revenue: revenue ? {
          "Latest Funding": revenue["Latest Funding"] || "",
          "Latest Funding Amount": revenue["Latest Funding Amount"] || null,
          companyid: revenue.companyid
        } : {
          "Latest Funding": "",
          "Latest Funding Amount": null,
          companyid: company ? company.companyid : null
        },
        social: social ? {
          "Company Linkedin Url": social["Company Linkedin Url"] || "",
          "Facebook Url": social["Facebook Url"] || "",
          "Twitter Url": social["Twitter Url"] || "",
          companyid: social.companyid
        } : {
          "Company Linkedin Url": "",
          "Facebook Url": "",
          "Twitter Url": "",
          companyid: company ? company.companyid : null
        }
      };
    });
    res.status(200).json(combinedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
  }
});
 
// Ajouter un client
app.post('/api/clients', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      firstName,
      lastName,
      title,
      seniority,
      departments,
      mobilePhone,
      email,
      EmailStatus,
      company,
      geo,
      social,
      companyRevenue,
    } = req.body;

    // Required Fields Validation
    if (!firstName || !lastName || !email || !company || !geo || !companyRevenue) {
      return res.status(400).json({ error: "Les champs requis sont manquants." });
    }
    
    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM personaldetails WHERE email = $1';
    const emailCheckResult = await client.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "L'email existe déjà." });
    }

    await client.query('BEGIN');

    // Insert Personal Details
    const personalResult = await client.query(
      `INSERT INTO personaldetails (
        "First Name", "Last Name", "title", "seniority", "departments", 
        "mobilePhone", "email", "EmailStatus" 
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        firstName || '',
        lastName || '',
        title || '',
        seniority || '',
        departments || '',
        mobilePhone || '',
        email || '',
        EmailStatus || '',
      ]
    );

    // Continue with remaining insertions as before...
    const personalData = personalResult.rows[0];
    const personalId = personalData.personalid;
    const companyResult = await client.query(
      `INSERT INTO companydetails (
        "company", "Email", "Phone", "employees", "industry", 
        "SEO Description", "personalid"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        company.company || '',
        company.email || '',
        company.phone || '',
        parseInt(company.employees, 10) || null,
        company.industry || '',
        company.seoDescription || '',
        personalId
      ]
    );

    const companyData = companyResult.rows[0];
    const companyId = companyData.companyid; // Get the generated companyid

    let geoResult, socialResult, revenueResult; // Define variables to store results

    // Insert Geo Localisation
    if (geo) {
        console.log("Inserting Geo Data:", geo, "for Company ID:", companyId); // Add logging
        try {
            geoResult = await client.query(
              `INSERT INTO geolocalisation (address, city, state, country, companyid)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING *`,
              [
                geo.address || '',
                geo.city || '',
                geo.state || '',
                geo.country || '',
                companyId
              ]
            );
            console.log("Geo Data Inserted:", geoResult.rows[0]); // Add logging
        } catch (geoError) {
            console.error("Error inserting Geo Data:", geoError);
            throw geoError; // Re-throw to trigger ROLLBACK
        }
    }

    // Insert Social Details
    if (social) {
        console.log("Inserting Social Data:", social, "for Company ID:", companyId); // Add logging
        try {
            socialResult = await client.query(
              `INSERT INTO socialdetails ("Company Linkedin Url", "Facebook Url", "Twitter Url", companyid)
               VALUES ($1, $2, $3, $4)
               RETURNING *`,
              [
                social.linkedinUrl || '',
                social.facebookUrl || '',
                social.twitterUrl || '',
                companyId
              ]
            );
            console.log("Social Data Inserted:", socialResult.rows[0]); // Add logging
        } catch (socialError) {
            console.error("Error inserting Social Data:", socialError);
            throw socialError; // Re-throw to trigger ROLLBACK
        }
    }

    // Insert Company Revenue
    if (companyRevenue) {
        console.log("Inserting Revenue Data:", companyRevenue, "for Company ID:", companyId); // Add logging
        try {
            let parsedLatestFunding = null;
            // Ensure date is valid before parsing
            if (companyRevenue.latestFunding && typeof companyRevenue.latestFunding === 'string' && !isNaN(Date.parse(companyRevenue.latestFunding))) {
                parsedLatestFunding = new Date(companyRevenue.latestFunding).toISOString().split('T')[0];
            } else if (companyRevenue.latestFunding) {
                 console.warn("Invalid date format for latestFunding:", companyRevenue.latestFunding);
            }

            let parsedLatestFundingAmount = null;
            // Ensure amount is a potentially valid number string or number before parsing
            if (companyRevenue.latestFundingAmount !== null && companyRevenue.latestFundingAmount !== undefined && companyRevenue.latestFundingAmount !== '') {
                 const amount = parseFloat(companyRevenue.latestFundingAmount);
                 if (!isNaN(amount)) {
                     parsedLatestFundingAmount = amount;
                 } else {
                     console.warn("Invalid number format for latestFundingAmount:", companyRevenue.latestFundingAmount);
                 }
            }

            revenueResult = await client.query(
              `INSERT INTO companyrevenue ("Latest Funding", "Latest Funding Amount", companyid)
               VALUES ($1, $2, $3)
               RETURNING *`,
              [
                parsedLatestFunding, // Use parsed date or null
                parsedLatestFundingAmount, // Use parsed amount or null
                companyId // Use the companyId
              ]
            );
            console.log("Revenue Data Inserted:", revenueResult.rows[0]); // Add logging
        } catch (revenueError) {
            console.error("Error inserting Revenue Data:", revenueError);
            throw revenueError; // Re-throw to trigger ROLLBACK
        }
    }

    // Commit transaction if everything is successful
    await client.query('COMMIT');

    // Construct response object including newly inserted details
    const responseData = {
        message: "Client ajouté avec succès.",
        personalDetails: personalData,
        companyDetails: companyData,
        ...(geoResult && { geoDetails: geoResult.rows[0] }),
        ...(socialResult && { socialDetails: socialResult.rows[0] }),
        ...(revenueResult && { revenueDetails: revenueResult.rows[0] })
    };

    res.status(201).json(responseData); // Send back the comprehensive success response
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du client.' });
  } finally {
    client.release();
  }
});

// Suppression d'une ressource
app.delete('/api/ressources/delete/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required to delete the resource." });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM socialdetails
       WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $1)`,
      [id]
    );

    await client.query(
      `DELETE FROM companyrevenue
       WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $1)`,
      [id]
    );

    await client.query(
      `DELETE FROM geolocalisation
       WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $1)`,
      [id]
    );

    await client.query(
      `DELETE FROM companydetails
       WHERE personalid = $1`,
      [id]
    );

    await client.query(
      `DELETE FROM personaldetails
       WHERE personalid = $1`,
      [id]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error deleting resource:", error.message);
    res.status(500).json({ error: "Server error while deleting resource." });
  } finally {
    client.release();
  }
});

// Mise à jour d'une ressource
app.put('/api/ressources/update/:id', async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).json({ error: "Request body is required." });
  }

  const {
    personalDetails,
    companyDetails,
    geoDetails,
    revenueDetails,
    socialDetails
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (personalDetails) {
      await client.query(
        `UPDATE personaldetails SET 
            "First Name" = $1, 
            "Last Name" = $2, 
            title = $3, 
            seniority = $4, 
            departments = $5, 
            "mobilePhone" = $6, 
            email = $7, 
            "EmailStatus" = $8 
        WHERE personalid = $9`,
        [
          personalDetails.firstName,
          personalDetails.lastName,
          personalDetails.title,
          personalDetails.seniority,
          personalDetails.departments,
          personalDetails.mobilePhone,
          personalDetails.email,
          personalDetails.EmailStatus,
          id
        ]
      );
    }

    if (companyDetails) {
      await client.query(
        `UPDATE companydetails SET 
            company = $1, 
            "Email" = $2, 
            "Phone" = $3, 
            employees = $4, 
            industry = $5, 
            "SEO Description" = $6 
        WHERE personalid = $7`,
        [
          companyDetails.company,
          companyDetails.email,
          companyDetails.phone,
          parseInt(companyDetails.employees, 10),
          companyDetails.industry,
          companyDetails.seoDescription,
          id
        ]
      );
    }

    if (geoDetails) {
      await client.query(
        `UPDATE geolocalisation SET 
            address = $1, 
            city = $2, 
            state = $3, 
            country = $4 
        WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $5)`,
        [
          geoDetails.address,
          geoDetails.city,
          geoDetails.state,
          geoDetails.country,
          id
        ]
      );
    }

    if (revenueDetails) {
      const { latestFunding, latestFundingAmount } = revenueDetails;
      const currentDate = new Date();
      let parsedLatestFunding;

      if (latestFunding && !isNaN(Date.parse(latestFunding))) {
        parsedLatestFunding = new Date(latestFunding).toISOString().split('T')[0];
      } else {
        parsedLatestFunding = currentDate.toISOString().split('T')[0];
      }

      await client.query(
        `UPDATE companyrevenue SET 
            "Latest Funding" = $1,  
            "Latest Funding Amount" = $2 
        WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $3)`,
        [
          parsedLatestFunding,
          parseInt(latestFundingAmount, 10),
          id
        ]
      );
    }

    if (socialDetails) {
      await client.query(
        `UPDATE socialdetails SET 
            "Company Linkedin Url" = $1, 
            "Facebook Url" = $2, 
            "Twitter Url" = $3 
        WHERE companyid = (SELECT companyid FROM companydetails WHERE personalid = $4)`,
        [
          socialDetails.linkedinUrl,
          socialDetails.facebookUrl,
          socialDetails.twitterUrl,
          id
        ]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Data updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error during update:", error.message);
    res.status(500).json({ error: 'Server error while updating data.' });
  } finally {
    client.release();
  }
});

// Récupérer les employés d'une entreprise
app.get('/api/company/employees/:company', async (req, res) => {
  try {
    const { company } = req.params;

    const result = await pool.query(
      `SELECT 
        pd.personalid, 
        pd."First Name", 
        pd."Last Name", 
        pd.title, 
        pd.seniority, 
        pd.departments, 
        pd."mobilePhone" as "mobilePhone", 
        pd.email, 
        pd."EmailStatus" as "emailStatus"
       FROM personaldetails pd
       INNER JOIN companydetails cd ON pd.personalid = cd.personalid
       WHERE cd.company ILIKE $1`,
      [`%${company}%`]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: `No employees found for company: ${company}`
      });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({
      error: "Server error while fetching employees.",
      details: err.message
    });
  }
});

// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});