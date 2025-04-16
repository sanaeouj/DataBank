// File: src/pages/People.js
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import mockContacts from "../data/mockContacts.json";

const People = () => {
  const [filters, setFilters] = useState({});

  return (
    <Box>
      <Typography variant="h5" sx={{ p: 2 }}>
        People List
      </Typography>
      <Box sx={{ display: "flex" }}>
        <FilterSidebar filters={filters} setFilters={setFilters} data={mockContacts} />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <ResultsTable data={mockContacts} filters={filters} />
        </Box>
      </Box>
    </Box>
  );
};

export default People;
