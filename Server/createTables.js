const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://company_db_yod8_user:4UHiQvoPYy0DevDVFhHmRqw6RbPu1ibK@dpg-d0lj2nl6ubrc73c50k8g-a.oregon-postgres.render.com:5432/company_db_yod8',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(res.rows);
  } catch (err) {
    console.error('Erreur connexion :', err);
  } finally {
    await pool.end();
  }
})();