import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import Sidebar from "../components/Sidebar";
import ResultTable from "../components/ResultTable";

const People = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ressources/all");
        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = key.includes(".")
          ? key.split(".").reduce((acc, part) => acc?.[part], item)
          : item[key];
        let valueToMatch = itemValue;
        if (typeof valueToMatch === 'object' && valueToMatch !== null) {
          valueToMatch = Object.values(valueToMatch).join(' ');
        }
        if (valueToMatch === undefined || valueToMatch === null) return false;
        const normalizedValueToMatch = valueToMatch.toString().toLowerCase().trim();
        const normalizedFilterValue = value.toLowerCase().trim();
        return normalizedValueToMatch.includes(normalizedFilterValue);
      });
    });
  };
  const filteredData = applyFilters(data);

  return (
    
    <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Sidebar />

    {data.length > 0 ? (
      <FilterSidebar filters={filters} setFilters={setFilters} data={data} />
    ) : (
      <Typography variant="h6" sx={{ color: "white", p: 2 }}>
        Loading filters...
      </Typography>
    )}
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        People List
      </Typography>
      <ResultTable data={filteredData} filters={filters} />
    </Box>
  </Box>
  );
};

export default People;
