import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDF9RH2GrQkvKVDgBlDgxRE2D4RH5qXHRk",
 authDomain: "databank-f.onrender.com",
  projectId: "databanklog",
  storageBucket: "databanklog.appspot.com",
  messagingSenderId: "105550405268",
  appId: "1:105550405268:web:cb64ae254dce1b9278de81",
 };

const app = initializeApp(firebaseConfig);

export default app;
