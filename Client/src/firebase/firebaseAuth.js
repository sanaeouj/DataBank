import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "./firebase.js";

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, googleProvider };