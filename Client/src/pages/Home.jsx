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
import mockContacts from "../data/MockContacts";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

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
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const totalClients = mockContacts.length;
  const ClientValide = mockContacts.filter(
    (contact) => contact.emailStatus.toLowerCase() === "valide"
  ).length;
  const ClientManager = mockContacts.filter(
    (contact) => contact.title.toLowerCase() === "manager"
  ).length;

  const groupByCountryAndState = () => {
    const locationCounts = mockContacts.reduce((acc, contact) => {
      const country = contact.companyCountry || "Unknown Country";
      const state = contact.companyState || "Unknown State";
      const key = `${country} - ${state}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return locationCounts;
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const calculateCompanies = () => {
    const uniqueCompanies = new Set(
      mockContacts
        .filter((contact) => contact.company && contact.company.trim() !== "")
        .map((contact) => contact.company.trim())
    );
    return uniqueCompanies.size;
  };

  const groupByDepartments = () => {
    const departmentCounts = mockContacts.reduce((acc, contact) => {
      const department = contact.departments || "Unknown";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});
    return departmentCounts;
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

          {/* Tasks & Progress */}
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

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Tasks
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  marginRight: "8px",
                  width: "50%",
                  height: "40px",
                  fontSize: "16px",
                  backgroundColor: "#1e1e1e",
                  color: "white",
                }}
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "yellow", color: "black" }}
                onClick={handleAddTask}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {tasks.map((task, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#1e1e1e",
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    width: "100%",
                    maxWidth: "50%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleComplete(index)}
                        sx={{
                          color: "white",
                          "&.Mui-checked": { color: "yellow" },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: "white",
                        }}
                      >
                        {task.text}
                      </Typography>
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "black",
                      color: "#444",
                    }}
                    onClick={() => handleDeleteTask(index)}
                  >
                    X
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
