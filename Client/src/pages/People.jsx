import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import mockContacts from "../data/mockContacts.json"; // Assuming this is your JSON data
import Sidebar from "../components/Sidebar";

const People = () => {
  const [filters, setFilters] = useState({});

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          data={mockContacts} // Pass the JSON data to FilterSidebar
        />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            People List
          </Typography>
          <ResultsTable data={mockContacts} filters={filters} /> // Pass the JSON data to ResultsTable
        </Box>
      </Box>
    </Box>
  );
};

export default People;