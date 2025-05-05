import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import Sidebar from "../components/Sidebar";
import ResultTable from "../components/ResultTable";

const People = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/ressources/all"
        );
        const result = await response.json();
        console.log("Data sample:", result[0]);  
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

  console.log("Current filters before applying:", filters);

  const filteredData = applyFilters(data);
  console.log("Filtered Data:", filteredData);

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: "100vh",
        bgcolor: "#242424",
        width: "100vw-350px",
      }}
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
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          People List
        </Typography>
        {showTable ? (
          <ResultTable data={filteredData} filters={filters} />
        ) : (
          <Typography variant="body1" sx={{ color: "gray" }}>
            Please select a filter to display the table.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default People;
