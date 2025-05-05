import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Companies = () => {
  const [data, setData] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/companies");
      const companies = response.data;

       const companyCount = {};

       companies.forEach(company => {
        companyCount[company.company] = (companyCount[company.company] || 0) + 1;
      });

       const uniqueCompanies = Object.keys(companyCount).map(companyName => {
        const firstOccurrence = companies.find(company => company.company === companyName);
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
    { field: "company", headerName: "Company Name", width: 250 },
    { field: "industry", headerName: "Industry", width: 250 },
    { field: "Phone", headerName: "Phone", width: 150 },
    { field: "Email", headerName: "Email", width: 300 },
    { field: "employees", headerName: "Employees", width: 200 },
    { field: "count", headerName: "Count People", width: 150 },   
    { field: "SEO Description", headerName: "SEO Description", flex: 1 },
  ];

  return (
    <div style={{ display: "flex",width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px", backgroundColor: "#1e1e1e", color: "white" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Company Data
        </Typography>
        <Box sx={{ height: '100vh', width: '100%' }}>
          <DataGrid
            rows={data}
            columns={displayedColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.company}  
            sx={{
              fontSize: "20px",
              height: "100%",
              overflowX: "auto",
              backgroundColor: "#1e1e1e",
              color: "white",
               "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1e1e1e",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row": { backgroundColor: "#1e1e1e", color: "white" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#1e1e1e",
                color: "white",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#1e1e1e",
                color: "white",
              },
              "& .MuiDataGrid-filler": { backgroundColor: "#1e1e1e", color: "white" },
              "& .MuiDataGrid-cell:hover": {
                backgroundColor: "#1e1e1e",
                color: "white",
              },
              "& .MuiDataGrid-footerCell": {
                backgroundColor: "#1e1e1e",
                color: "white",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1e1e1e",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
                textAlign: "center",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaderCheckbox": { color: "white" },
              "& .MuiDataGrid-rowCheckbox": { color: "white" },
              "& .MuiTablePagination-displayedRows": { color: "white" },
              "& .MuiTablePagination-actions": { color: "white" },
              "& .MuiTablePagination-selectIcon": { color: "white" },
              "& .MuiTablePagination-selectLabel": { color: "white" },
              "& .MuiTablePagination-menuItem": { color: "white" },
              "& .MuiTablePagination-menuItem:hover": {
                backgroundColor: "#444",
                color: "white",
              },
              "& .MuiTablePagination-menuItem.selected": {
                backgroundColor: "#444",
                color: "white",
              },
              "& .MuiDataGrid-cell": {
                backgroundColor: "#1e1e1e",
                color: "white",
           
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default Companies;