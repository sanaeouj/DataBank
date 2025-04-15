import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#121212",
        color: "white",
      }}
    >
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="static"
          sx={{ bgcolor: "#2c2c2c", boxShadow: "none" }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Onboarding Hub
            </Typography>
            <Typography>Progress: 0%</Typography>
          </Toolbar>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{ bgcolor: "#444", height: 6 }}
          />
        </AppBar>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ bgcolor: "#2a2a2a", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Setup
            </Typography>
            <Typography>0/11 tasks completed</Typography>
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" sx={{ bgcolor: "#3b3b3b" }}>
              Add Teammates
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#3b3b3b" }}>
              Learn about Credits
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
