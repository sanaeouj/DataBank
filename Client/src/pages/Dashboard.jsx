import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const nameParts = storedEmail.split("@")[0].split(".");
      const formattedName = nameParts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      setUserName(formattedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "80vh",
        bgcolor: "#121212",
        color: "white",
        margin: 10,
        padding: 10,
        overflow: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="static"
          sx={{ bgcolor: "#121212", boxShadow: "none" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Onboarding Hub
            </Typography>
            <Typography sx={{ mr: 2 }}>Welcome, {userName}</Typography>
            <Button
              variant="contained"
              sx={{
                m: 2,
                bgcolor: "yellow",
                color: "#1e1e1e",
                "&:hover": {
                  bgcolor: "#fdd835",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{ bgcolor: "#444", height: 6 }}
          />
        </AppBar>

        <Box sx={{ mt: 4, px: 3, width: "100%" }}>
          <Box
            sx={{
              bgcolor: "#121212",
              borderRadius: 2,
              p: 3,
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Welcome, {userName} 👋
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
