import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import Sidebar from "../components/Sidebar";
import ResultTable from "../components/ResultTable";

const People = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/ressources/all"
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
  
         if (typeof itemValue === 'object' && itemValue !== null) {
          itemValue = Object.values(itemValue).join(" ");
        }
  
        const normalizedValueToMatch = String(itemValue).toLowerCase().trim();
        const normalizedFilterValue = value.toLowerCase().trim();
  
         return normalizedValueToMatch===(normalizedFilterValue);
      });
    });
  };
  const filteredData = applyFilters(data);

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <Sidebar />
      {loading ? (
        <Typography variant="h6" sx={{ color: "white", p: 2 }}>
          Loading filters...
        </Typography>
      ) : (
        <FilterSidebar filters={filters} setFilters={setFilters} data={data} />
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
