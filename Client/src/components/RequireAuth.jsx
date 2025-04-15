 import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const RequireAuth = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/signup");  
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : null;
};

export default RequireAuth;
