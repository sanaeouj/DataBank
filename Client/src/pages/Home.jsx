import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
   const userName = localStorage.getItem("userName") || "User"; 
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Welcome, {userName}!
      </Typography>
      <Typography variant="body1" sx={{ color: "gray" }}>
        This is your dashboard. Explore and manage your data.
      </Typography>
    </Box>
  );
};

export default Home;