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
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
     const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const nameParts = storedEmail.split("@")[0].split(".");
      const formattedName = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
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

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "97vw", bgcolor: "#121212", color: "white" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        <AppBar position="static" sx={{ bgcolor: "#121212", boxShadow: "none" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Onboarding Hub</Typography>
            <Typography sx={{ mr: 2 }}>Welcome, {userName}</Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "yellow", color: "black", "&:hover": { bgcolor: "#fdd835" } }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, px: 3, width: "100%" }}>
          <Box sx={{ bgcolor: "#121212", borderRadius: 2, p: 3, width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Welcome, {userName} 👋
            </Typography>
            <Typography variant="body1" gutterBottom>
              This is your dashboard where you can manage your onboarding tasks.
            </Typography>

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

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
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
                            sx={{ color: "white", "&.Mui-checked": { color: "yellow" } }}
                          />
                        }
                        label={
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: task.completed ? "line-through" : "none",
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
      </Box>
    </Box>
  );
};

export default Home;
