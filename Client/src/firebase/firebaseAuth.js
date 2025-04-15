import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import app from "./firebase.js";  

 const auth = getAuth(app);

 const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",  
});

 const microsoftProvider = new OAuthProvider("microsoft.com");

export { auth, googleProvider, microsoftProvider };