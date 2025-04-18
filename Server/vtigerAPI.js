// vtigerAPI.js
const axios = require('axios');
require("dotenv").config();

const VTIGER_URL = process.env.VTIGER_URL;
const VTIGER_USERNAME = process.env.VTIGER_USERNAME;
const VTIGER_PASSWORD = process.env.VTIGER_PASSWORD;


let session = null; // Stocker la session ici

async function loginToVTiger() {
  try {
      if (session) {
          return session;
      }

      const loginEndpoint = `${VTIGER_URL}/index.php/autologin`;
        console.log('Login endpoint:', loginEndpoint);
        console.log('Login data:', { username: VTIGER_USERNAME, password: VTIGER_PASSWORD });
      const loginData = {
          username: VTIGER_USERNAME,
          password: VTIGER_PASSWORD,
      };
      const response = await axios.post(loginEndpoint, loginData);
        //const params = new URLSearchParams();
        //params.append('operation', 'login');
        //params.append('username', VTIGER_USERNAME);
        //params.append('password', VTIGER_PASSWORD);

        //const response = await axios.post(loginEndpoint, params);
      console.log('Login response:', response.data);
      if (response.status === 200 ) {
        //  const sessionId = response.data.result.sessionName; // Ancien
          const sessionId = response.data.sessionid;
          session = sessionId;  // Stocker la session
          return sessionId;

      }
      else {
          console.error('Erreur d\'authentification:', response.status, response.data);
          throw new Error(`Authentication failed: ${response.status} - ${JSON.stringify(response.data)}`);
      }
  } catch (error) {
      console.error('Erreur de login:', error);
      throw new Error(`Login failed: ${error.message}`);
  }
}

async function getContacts(sessionId) {
    if (!sessionId) {
        throw new Error('No session found. Please login first.');
    }

  try {
        const contactsEndpoint = `${VTIGER_URL}/index.php/webservice/v2.0/ListTypes?sessionid=${sessionId}&elementType=Contacts`;
    // const contactsEndpoint = `${VTIGER_URL}/webservice.php?operation=query&sessionName=${sessionName}&query=select * FROM Contacts;`;   //Ancien
         const response = await axios.get(contactsEndpoint);

        if (response.status === 200 && response.data && response.data.result) {
            return response.data.result;
        }
         else {
              console.error('Erreur lors de la récupération des contacts:', response.status, response.data);
              throw new Error(`Failed to fetch contacts: ${response.status} - ${JSON.stringify(response.data)}`);
       }
    } catch (error) {
        console.error('Erreur lors de la requête GET contacts:', error);
        throw new Error(`An error occurred while fetching contacts: ${error.message}`);
    }
}

module.exports = { loginToVTiger, getContacts };