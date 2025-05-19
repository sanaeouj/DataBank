 import React from "react";
import {
  Box,
  Button,
  FormControl,
   MenuItem,
  Select,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FilterX } from "lucide-react";

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

const FilterSidebar = ({ filters, setFilters, data }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const getUniqueValues = (key, filter = {}) => {
    if (!data || data.length === 0) return [];
    const values = data
      .filter((item) =>
        Object.keys(filter).every((filterKey) => {
          const keys = filterKey.split(".");
          const filterValue = keys.reduce((acc, part) => acc?.[part], item);
          return filter[filterKey] ? filter[filterKey] === filterValue : true;
        })
      )
      .map((item) => {
        const keys = key.split(".");
        return keys.reduce((acc, part) => acc?.[part], item);
      })
      .filter((value) => value !== undefined && value !== null);
    return Array.from(new Set(values)).sort();
  };

  const fields = [
    ["Title", "title"],
    ["Email Status", "EmailStatus"],
    ["Industry", "company.industry"],
    ["Seniority", "seniority"],
    ["Departments", "departments"],
    ["Company", "company.company"],
    ["Country", "geo.country"],
    ["State", "geo.state", { "geo.country": filters["geo.country"] }],
    ["City", "geo.city", {
      "geo.country": filters["geo.country"],
      "geo.state": filters["geo.state"],
    }],
  ];

  const renderDropdown = (label, key, filter = {}) => {
  const values = getUniqueValues(key, filter);
  return (
    <Box key={key} sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ 
        color: "text.secondary", 
        mb: 1,
         fontWeight: 500,
      }}>
        {label}
      </Typography>
      <FormControl fullWidth>
        <Select
          name={key}
          value={filters[key] || ""}
          onChange={handleChange}
          displayEmpty
          sx={{
            color: "text.primary",
            height: 40,
            fontSize: 14,
            borderRadius: 2,
            backgroundColor: alpha("#fff", 0.03),
            "&:hover": { backgroundColor: alpha("#fff", 0.05) },
            "& .MuiSelect-icon": { color: "text.secondary" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "background.paper",
                color: "text.primary",
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: alpha("#fff", 0.05),
                },
                "& .Mui-selected": {
                  backgroundColor: alpha("#60a5fa", 0.15),
                },
              },
            },
          }}
        >
          {values.map((value, index) => (
            <MenuItem key={index} value={value}>
              {typeof value === "string" ? value : JSON.stringify(value)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: 300,
          p: 3,
          bgcolor: "background.paper",
          color: "text.primary",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Filters
        </Typography>

        <Button
          variant="outlined"
          onClick={handleResetFilters}
          startIcon={<FilterX size={18} />}
          sx={{
            mb: 2,
            color: "text.primary",
            borderColor: alpha("#fff", 0.2),
            "&:hover": {
              bgcolor: alpha("#fff", 0.05),
              borderColor: "primary.main",
            },
          }}
        >
          Reset Filters
        </Button>

        {fields.map(([label, key, condition]) =>
          renderDropdown(label, key, condition)
        )}
      </Box>
    </ThemeProvider>
  );
};

export default FilterSidebar;
