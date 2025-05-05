import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
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
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
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

    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/ressources/all"
        );
        const result = await response.json();
        setData(result);
        console.log("data:", result);

        console.log("title:");
        result.forEach((item, index) => {
          console.log(`Index: ${index}, title: ${item.title}`);
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
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
      if (editIndex !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, { text: newTask, completed: false }]);
      }
      setTimeout(() => setNewTask(""), 100);
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setNewTask(tasks[index].text);
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
  const ClientValide = data.reduce((count, item) => {
    return count + (item.EmailStatus === "Valid" ? 1 : 0);
  }, 0);
  const ClientManager = data.filter((item) => item.title === "Manager").length;

  const calculateCompanies = () => {
    const uniqueCompanies = new Set(
      data
        .map((item) =>
          typeof item.company.company === "string"
            ? item.company.company.toLowerCase().trim()
            : null
        )
        .filter((company) => company)
    );

    return uniqueCompanies.size;
  };

  const groupByCountry = () => {
    return data.reduce((acc, item) => {
      const country = item.geo?.country;
      if (country) {
        acc[country] = (acc[country] || 0) + 1;
      }
      return acc;
    }, {});
  };
  const groupByTitle = () => {
    return data.reduce((acc, item) => {
      const title = item.title;
      if (title) {
        acc[title] = (acc[title] || 0) + 1; // Comptez les occurrences de chaque titre
      }
      return acc;
    }, {});
  };
  return (
    <Box
      sx={{ display: "flex", height: "100vh", width: "100vw", color: "white" }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
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
                color: "#1e1e1e",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
              mt: 4,
            }}
          >
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Total Customers
              </Typography>
              <Typography variant="h4">{totalClients}</Typography>
            </Box>
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Valid Client</Typography>
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
                Title Distribution:
              </Typography>
              {Object.entries(groupByTitle()).map(([title, count]) => (
                <Typography key={title} variant="body2" sx={{ mt: 1 }}>
                  {title}: {count}
                </Typography>
              ))}
            </Box>
            <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Contacts by Country:
              </Typography>
              {Object.entries(groupByCountry()).map(([country, count]) => (
                <Typography key={country} variant="body2" sx={{ mt: 1 }}>
                  {country}: {count}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#1e1e1e", p: 2, borderRadius: 2, mt: 4 }}>
            <Typography variant="h6">Manage Tasks</Typography>
            <TextField
              label="New Task"
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              sx={{
                mt: 2,
                mb: 2,
                width: "100%",
                "& .MuiInputBase-root": {
                  backgroundColor: "#242424",
                  color: "white",
                  border: "1px none white",
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  color: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  color: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiTablePagination-menuItem:hover": {
                  backgroundColor: "#242424",
                  color: "white",
                },
                "& .MuiInputBase-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddTask}
              sx={{
                bgcolor: "yellow",
                color: "#1e1e1e",
                "&:hover": { bgcolor: "#fdd835" },
              }}
            >
              Add Task
            </Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table  >
                <TableHead  >
                  <TableRow sx={{ color: "white" }}>
                    <TableCell>Task</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.text}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => toggleComplete(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteTask(index)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditTask(index)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mt: "auto", pt: 4 }}>
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
  );
};

export default Home;
