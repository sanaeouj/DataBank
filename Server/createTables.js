const { Pool } = require('pg');

const pool = new Pool({
  user: 'company_db_yod8_user',
  host: 'dpg-d0lj2nl6ubrc73c50k8g-a.oregon-postgres.render.com',
  database: 'company_db_yod8',
  password: '4UHiQvoPYy0DevDVFhHmRqw6RbPu1ibK',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

const createTablesSQL = `
CREATE SEQUENCE IF NOT EXISTS public.personaldetails_personalid_seq;
CREATE SEQUENCE IF NOT EXISTS public.companydetails_companyid_seq;
CREATE SEQUENCE IF NOT EXISTS public.geolocalisation_geoid_seq;
CREATE SEQUENCE IF NOT EXISTS public.companyrevenue_revenueid_seq;
CREATE SEQUENCE IF NOT EXISTS public.socialdetails_socialid_seq;

CREATE TABLE IF NOT EXISTS public.personaldetails (
    personalid integer PRIMARY KEY DEFAULT nextval('public.personaldetails_personalid_seq'::regclass),
    "First Name" character varying(255),
    "Last Name" character varying(255),
    title character varying(255),
    seniority character varying(255),
    departments character varying(255),
    "mobilePhone" character varying(20),
    email character varying(255),
    "EmailStatus" character varying(50)
);

CREATE TABLE IF NOT EXISTS public.companydetails (
    companyid integer PRIMARY KEY DEFAULT nextval('public.companydetails_companyid_seq'::regclass),
    personalid integer,
    company character varying(255),
    "Email" character varying(255),
    "Phone" character varying(20),
    employees integer,
    industry character varying(255),
    "SEO Description" text,
    CONSTRAINT fk_personal_company FOREIGN KEY (personalid) REFERENCES public.personaldetails(personalid)
);

CREATE TABLE IF NOT EXISTS public.geolocalisation (
    geoid integer PRIMARY KEY DEFAULT nextval('public.geolocalisation_geoid_seq'::regclass),
    companyid integer,
    address character varying(255),
    city character varying(255),
    state character varying(255),
    country character varying(255),
    CONSTRAINT fk_company_geo FOREIGN KEY (companyid) REFERENCES public.companydetails(companyid)
);

CREATE TABLE IF NOT EXISTS public.companyrevenue (
    revenueid integer PRIMARY KEY DEFAULT nextval('public.companyrevenue_revenueid_seq'::regclass),
    companyid integer,
    "Annual Revenue" integer,
    "Total Funding" integer,
    "Latest Funding" date,
    "Latest Funding Amount" character varying(255),
    CONSTRAINT fk_company_revenue FOREIGN KEY (companyid) REFERENCES public.companydetails(companyid)
);

CREATE TABLE IF NOT EXISTS public.socialdetails (
    socialid integer PRIMARY KEY DEFAULT nextval('public.socialdetails_socialid_seq'::regclass),
    companyid integer,
    "Company Linkedin Url" character varying(255),
    "Facebook Url" character varying(255),
    "Twitter Url" character varying(255),
    CONSTRAINT fk_company_social FOREIGN KEY (companyid) REFERENCES public.companydetails(companyid)
);
`;

(async () => {
  try {
    await pool.query(createTablesSQL);
    console.log("Tables créées avec succès !");
  } catch (err) {
    console.error("Erreur lors de la création des tables :", err);
  } finally {
    await pool.end();
  }
})();