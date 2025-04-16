import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const FilterSidebar = ({ filters, setFilters, data }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUniqueValues = (key) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).sort();

  const renderDropdown = (label, key, values) => (
    <FormControl key={key} fullWidth sx={{ mt: 2 }}>
      <InputLabel
        sx={{ color: "white", fontSize: 16 }}
        shrink={true} 
      >
        {label}
      </InputLabel>
      <Select
        name={key}
        value={filters[key] || ""}
        onChange={handleChange}
        displayEmpty
        sx={{
          color: "white",
          "& .MuiSelect-icon": { color: "white" },
        }}
        inputProps={{
          sx: {
            color: "white",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "black",
              color: "white",
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "#333",
              },
              "& .Mui-selected": {
                backgroundColor: "#444 !important",
              },
            },
          },
        }}
      >
        <MenuItem value="">
          <em>Aucun</em>
        </MenuItem>
        {values.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box
      sx={{
        width: 250,
        p: 2,
        borderRight: "1px solid #ccc",
        color: "white",
        bgcolor: "#1e1e1e",
        height: "100vh",
        overflowY: "auto",  
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        Filtres
      </Typography>
      {renderDropdown("Title", "title", getUniqueValues("title"))}
      {renderDropdown("Seniority", "seniority", getUniqueValues("seniority"))}
      {renderDropdown("Email Status", "emailStatus", getUniqueValues("emailStatus"))}
      {renderDropdown("Company", "company", getUniqueValues("company"))}
      {renderDropdown("Industry", "industry", getUniqueValues("industry"))}
      {renderDropdown("Technologies", "technologies", getUniqueValues("technologies"))}
      {renderDropdown("City", "city", getUniqueValues("city"))}
      {renderDropdown("Country", "country", getUniqueValues("country"))}
      {renderDropdown("Company State", "companyState", getUniqueValues("companyState"))}
      {renderDropdown("Company Country", "companyCountry", getUniqueValues("companyCountry"))}
      {renderDropdown("SEO Description", "seoDescription", getUniqueValues("seoDescription"))}
    </Box>
  );
};

export default FilterSidebar;
