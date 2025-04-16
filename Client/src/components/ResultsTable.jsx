import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

const ResultsTable = ({ data, filters }) => {
  const filteredData = data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return row[key] === value;
    });
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First Name", width: 120 },
    { field: "lastName", headerName: "Last Name", width: 120 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "seniority", headerName: "Seniority", width: 120 },
    { field: "departments", headerName: "Departments", width: 150 },
    { field: "company", headerName: "Company", width: 180 },
    { field: "companyNameForEmails", headerName: "Company Email Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "emailStatus", headerName: "Email Status", width: 120 },
    { field: "mobilePhone", headerName: "Mobile Phone", width: 150 },
    { field: "corporatePhone", headerName: "Corporate Phone", width: 150 },
    { field: "numEmployees", headerName: "Employees", width: 120 },
    { field: "industry", headerName: "Industry", width: 160 },
    { field: "keywords", headerName: "Keywords", width: 200, renderCell: (params) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {params.value?.map((kw, idx) => (
          <Chip key={idx} label={kw} size="small" />
        ))}
      </Box>
    )},
    { field: "personLinkedinUrl", headerName: "LinkedIn Profile", width: 250 },
    { field: "website", headerName: "Website", width: 200 },
    { field: "companyLinkedinUrl", headerName: "Company LinkedIn", width: 250 },
    { field: "facebookUrl", headerName: "Facebook", width: 200 },
    { field: "twitterUrl", headerName: "Twitter", width: 200 },
    { field: "city", headerName: "City", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "country", headerName: "Country", width: 100 },
    { field: "companyAddress", headerName: "Company Address", width: 250 },
    { field: "companyCity", headerName: "Company City", width: 150 },
    { field: "companyState", headerName: "Company State", width: 150 },
    { field: "companyCountry", headerName: "Company Country", width: 150 },
    { field: "seoDescription", headerName: "SEO Description", width: 250 },
    { field: "technologies", headerName: "Technologies", width: 200 },
    { field: "annualRevenue", headerName: "Annual Revenue", width: 150 },
    { field: "totalFunding", headerName: "Total Funding", width: 150 },
    { field: "latestFunding", headerName: "Latest Funding", width: 150 },
    { field: "latestFundingAmount", headerName: "Latest Funding Amount", width: 180 },
    { field: "lastRaisedAt", headerName: "Last Raised At", width: 150 },
    { field: "primaryEmailSource", headerName: "Primary Email Source", width: 200 },
    { field: "secondaryEmail", headerName: "Secondary Email", width: 220 },
    { field: "secondaryEmailSource", headerName: "Secondary Email Source", width: 200 },
    { field: "tertiaryEmail", headerName: "Tertiary Email", width: 220 },
    { field: "tertiaryEmailSource", headerName: "Tertiary Email Source", width: 200 },
  ];
  return (
    <div style={{ height: 1000, width: "100%" }}>
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={10}
        rowHeight={80}
        checkboxSelection
        initialState={{
          sorting: {
            sortModel: [{ field: "firstName", sort: "desc" }],
          },
        }}
        getRowId={(row) => row.id || `${row.firstName}-${row.lastName}`}
        sx={{
          fontSize: "18px",
          color: "white",
          "& .MuiDataGrid-columnHeaders": {
            color: "black",
            textAlign: "center",
          },
          "& .MuiDataGrid-cell": {
            color: "white",
            fontSize: "16px",
            padding: "4px 8px",
            textAlign: "center",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#444",
          },
        }}
      />
    </div>
  );
};

export default ResultsTable;
