import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]); // Example data for statistics

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const nameParts = storedEmail.split("@")[0].split(".");
      const formattedName = nameParts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      setUserName(formattedName);
    }

    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);

    // Fetch example data for statistics
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ressources/all");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = [...tasks, { text: newTask, completed: false }];
      setTasks(updatedTasks);
      setNewTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const progress = calculateProgress();

   const totalClients = data.length;
  const ClientValide = data.filter((item) => item.EmailStatus === "Valide").length;
  const ClientManager = data.filter((item) => item.title === "Manager").length;
  const calculateCompanies = () => {
    return new Set(
      data
        .map((item) => (typeof item.company === "string" ? item.company.toLowerCase().trim() : null))
        .filter((company) => company) // Supprimez les valeurs null ou undefined
    ).size+1; // Ajoutez 1 pour le client manager
  };
  const groupByDepartments = () => {
    return data.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1;
      return acc;
    }, {});
  };

  const groupByCountryAndState = () => {
    return data.reduce((acc, item) => {
      const location = `${item.country}, ${item.state}`;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#121212",
        color: "white",
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
                bgcolor: "yellow",
                color: "black",
                "&:hover": { bgcolor: "#fdd835" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            px: 3,
            pt: 4,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome, {userName} 👋
          </Typography>
          <Typography variant="body1" gutterBottom>
            This is your dashboard where you can manage your onboarding tasks.
          </Typography>

          {/* Statistics Section */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
              mt: 4,
            }}
          >
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Total Clients</Typography>
              <Typography variant="h4">{totalClients}</Typography>
            </Box>
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Client Valide</Typography>
              <Typography variant="h4">{ClientValide}</Typography>
            </Box>
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Client Manager</Typography>
              <Typography variant="h4">{ClientManager}</Typography>
            </Box>
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Total Companies</Typography>
              <Typography variant="h4">{calculateCompanies()}</Typography>
            </Box>
          </Box>

          {/* Distribution Section */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
              mt: 4,
            }}
          >
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Department Distribution:
              </Typography>
              {Object.entries(groupByDepartments()).map(([dep, count]) => (
                <Typography key={dep} variant="body2" sx={{ mt: 1 }}>
                  {dep}: {count}
                </Typography>
              ))}
            </Box>

            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Contacts by Country/State:
              </Typography>
              {Object.entries(groupByCountryAndState()).map(([loc, count]) => (
                <Typography key={loc} variant="body2" sx={{ mt: 1 }}>
                  {loc}: {count}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Tasks & Progress Section */}
          <Box sx={{ mt: "auto", pt: 4 }}>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: "#444",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#f4e33d",
                  },
                }}
              />
              <Typography sx={{ fontSize: "0.75rem", mt: 0.5, color: "#aaa" }}>
                {progress}% Completed
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
