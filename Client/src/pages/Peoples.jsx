import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import Sidebar from "../components/Sidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
 
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    error: { main: "#f87171" },
    background: { default: "#333", paper: "#1e1e1e" },
    text: { primary: "#f3f4f6", secondary: "#d1d5db" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
  },
});

const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(
    Object.keys(initialFilter).length > 0
  );
  const [savedFilters, setSavedFilters] = useState(() => {
    const stored = localStorage.getItem("savedFilters");
    return stored ? JSON.parse(stored) : {};
  });
  const [filterName, setFilterName] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://databank-yndl.onrender.com/api/ressources/all"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        let itemValue = key.includes(".")
          ? key.split(".").reduce((acc, part) => acc?.[part], item)
          : item[key];
        if (itemValue === undefined || itemValue === null) return false;
        if (typeof itemValue === "object" && itemValue !== null) {
          itemValue = Object.values(itemValue).join(" ");
        }
        const normalizedValueToMatch = String(itemValue).toLowerCase().trim();
        const normalizedFilterValue = value.toLowerCase().trim();
        return normalizedValueToMatch.includes(normalizedFilterValue);
      });
    });
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const updated = { ...savedFilters, [filterName]: filters };
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    setFilterName("");
  };

  const handleDeleteSavedFilter = (name) => {
    const updated = { ...savedFilters };
    delete updated[name];
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
  };

  const filteredData = applyFilters(data);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", height: "90vh", bgcolor: "#333", flexDirection: { xs: 'column', md: 'row' } }}
      >
        <Sidebar />
        {loading ? (
          <Typography variant="h6" sx={{ color: "white", p: 2 }}>
            Loading filters...
          </Typography>
        ) : (
          <FilterSidebar
            filters={filters}
            setFilters={(newFilters) => {
              setFilters(newFilters);
              setShowTable(true);
            }}
            data={data}
          />
        )}
        <Box sx={{ flexGrow: 1, p: 2, bgcolor: "#333" }}>
          <Typography variant="h5" sx={{ mb: 3, color: "white" }}>
            People List
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Enter filter name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{
                flexGrow: 0.1,
                bgcolor: "white",
                width: "150px",
                fontSize: "0.8rem",
                backgroundColor: "#333",

                "& .MuiInputBase-input": {
                  py: 0.5,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSaveFilter}
              sx={{
                flexShrink: 0,
                color: "white",
                fontSize: "0.8rem",
                padding: "4px 8px",
                marginBottom: "8px",
                backgroundColor: "#333",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Save
            </Button>
          </Box>
          {showTable ? (
            <ResultsTable data={filteredData} filters={filters} />
          ) : (
            <Typography variant="body1" sx={{ color: "gray" }}>
              Please select a filter to display the table.
            </Typography>
          )}

        
            </Box>
      </Box>
    </ThemeProvider>
  );
};

export default People;
