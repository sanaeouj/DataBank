// Companies.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Paper,
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  alpha,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, X as ClearIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    background: { default: "#333", paper: "#1e1e1e" },
    text: { primary: "#f3f4f6", secondary: "#d1d5db" },
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
  },
});

const Companies = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("https://databank-yndl.onrender.com/api/companies");
      const companies = response.data;

      const companyCount = {};
      companies.forEach((company) => {
        companyCount[company.company] =
          (companyCount[company.company] || 0) + 1;
      });

      const uniqueCompanies = Object.keys(companyCount).map((companyName) => {
        const firstOccurrence = companies.find(
          (company) => company.company === companyName
        );
        return {
          ...firstOccurrence,
          count: companyCount[companyName],
        };
      });

      setData(uniqueCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const displayedColumns = [
    { 
      field: "company", 
      headerName: "Company Name", 
      width: 200, 
      flex: 1,
      renderCell: (params) => (
        <Link
          component="button"
          onClick={() => setSelectedCompany(params.row)}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            '&:hover': {
              textDecoration: "underline",
            },
          }}
        >
          {params.value}
        </Link>
      )
    },
    { field: "industry", headerName: "Industry", width: 150 },
    { field: "Phone", headerName: "Phone", width: 150 },
    { field: "Email", headerName: "Email", width: 200 },
    { field: "employees", headerName: "Employees", width: 100 },
    { field: "count", headerName: "Count People", width: 150 },
    {
      field: "SEO Description",
      headerName: "SEO Description",
      width: 300,
      flex: 1,
    },
  ];

  const filteredData = data.filter((row) =>
    row.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "background.default" }}>
          <Container maxWidth="lg">
            {selectedCompany ? (
              <CompanyDetails 
                company={selectedCompany} 
                onBack={() => setSelectedCompany(null)} 
              />
            ) : (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${darkTheme.palette.primary.main}, ${darkTheme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Company Data
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: alpha(darkTheme.palette.common.white, 0.05),
                  }}
                >
                  <SearchIcon size={20} color="#9ca3af" />
                  <InputBase
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      ml: 2,
                      flex: 1,
                      color: "text.primary",
                      width: "100%",
                    }}
                    endAdornment={
                      searchTerm && (
                        <IconButton onClick={() => setSearchTerm("")}>
                          <ClearIcon size={16} color="#9ca3af" />
                        </IconButton>
                      )
                    }
                  />
                </Paper>
                <Box sx={{ height: 600, width: "70vw" }}>
                  <DataGrid
                    rows={filteredData}
                    columns={displayedColumns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.company}
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.primary",
                      "& .MuiDataGrid-columnHeaders": {
                        bgcolor: "background.default",
                        color: "text.primary",
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-row:hover": {
                        bgcolor: alpha(darkTheme.palette.primary.main, 0.1),
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Companies;