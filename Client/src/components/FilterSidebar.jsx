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
    const industryValues = getUniqueValues("company.industry");
    console.log("Industry Values:", industryValues);
  };

  const getUniqueValues = (key) => {
    if (!data || data.length === 0) {
      console.warn("The data array is empty or undefined.");
   
      return [];
    }

     const values = data
      .map((item) => key.split('.').reduce((acc, part) => acc?.[part], item))  
      .filter((value) => value !== undefined && value !== null); 

    if (values.length === 0) {
      console.warn(`No valid values found for key "${key}". Check if the key exists in the data.`);
    }

    return Array.from(new Set(values)).sort();  
  };

  const emailStatusValues = getUniqueValues("EmailStatus");
  const industryValues = getUniqueValues("company.industry");
  const titleValues = getUniqueValues("title");
  const seniorityValues = getUniqueValues("seniority");
  const departmentValues = getUniqueValues("departments");
  const companyValues = getUniqueValues("company.company");  
  const cityValues = getUniqueValues("geo.city");
  const stateValues = getUniqueValues("geo.state");
  const countryValues = getUniqueValues("geo.country");


  const renderDropdown = (label, key, values) => (
    <FormControl key={key} fullWidth sx={{ mt: 2 }}>
      <InputLabel sx={{ color: "white", fontSize: 16 }} shrink={true}>
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
        {values.map((value, index) => (
          <MenuItem key={`${value}-${index}`} value={value}>
            {typeof value === "string" ? value : JSON.stringify(value)}
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
      {renderDropdown("Title", "title", titleValues)}

      {renderDropdown("Email Status", "EmailStatus", emailStatusValues)}
      {renderDropdown("Industry", "industry", industryValues)}
      {renderDropdown("Seniority", "seniority", seniorityValues)}
      {renderDropdown("Departments", "departments", departmentValues)}
      {renderDropdown("Company", "company", companyValues)}  
      {renderDropdown("City", "City", cityValues)}
      {renderDropdown("State", "geo.state", stateValues)}
      {renderDropdown("Country", "geo.country", countryValues)}
    </Box>
  );
};

export default FilterSidebar;