import React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Box, Menu, MenuItem, Button, Chip } from "@mui/material";
import * as XLSX from "xlsx";
import { BiExport } from "react-icons/bi";

const ResultsTable = ({ data, filters }) => {
  const filteredData = data.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return row[key] === value;
    })
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "ResultsTable_Export.xlsx");
  };

  const exportToCSV = () => {
    const csvContent = [
      Object.keys(filteredData[0]).join(","),
      ...filteredData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ResultsTable_Export.csv";
    link.click();
  };

  const CustomToolbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button onClick={handleMenuOpen} style={{ color: "white" }}>
          <BiExport /> Export
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              exportToCSV();
              handleMenuClose();
            }}
          >
            Download as CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel();
              handleMenuClose();
            }}
          >
            Download as Excel
          </MenuItem>
        </Menu>
      </GridToolbarContainer>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflowX: "auto",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <DataGrid
        rows={filteredData}
        columns={[
          { field: "firstName", headerName: "First Name", width: 120 },
          { field: "lastName", headerName: "Last Name", width: 120 },
          { field: "title", headerName: "Title",  width: 200 },
          { field: "seniority", headerName: "Seniority", width: 120 },
          { field: "departments", headerName: "Departments", width: 150 },
          { field: "company", headerName: "Company", width: 180 },
          { field: "email", headerName: "Email", width: 220 },
          { field: "emailStatus", headerName: "Email Status", width: 150 },
          { field: "mobilePhone", headerName: "Mobile Phone", flex: 2, width: 150 },
          {
            field: "corporatePhone",
            headerName: "Corporate Phone",
            width: 150,
          },
          {
            field: "numEmployees",
            headerName: "Number of Employees",
            width: 180,
          },
          { field: "industry", headerName: "Industry", width: 150 },
          {
            field: "personLinkedinUrl",
            headerName: "LinkedIn Profile",
            width: 250,
            renderCell: (params) => (
              <a
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#90caf9" }}
              >
                LinkedIn
              </a>
            ),
          },
          {
            field: "website",
            headerName: "Website",
            width: 200,
            renderCell: (params) => (
              <a
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#90caf9" }}
              >
                {params.value}
              </a>
            ),
          },
          {
            field: "companyLinkedinUrl",
            headerName: "Company LinkedIn",
            width: 250,
            renderCell: (params) => (
              <a
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#90caf9" }}
              >
                LinkedIn
              </a>
            ),
          },
          {
            field: "facebookUrl",
            headerName: "Facebook",
            width: 200,
            renderCell: (params) => (
              <a
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#90caf9" }}
              >
                Facebook
              </a>
            ),
          },
          {
            field: "twitterUrl",
            headerName: "Twitter",
            width: 200,
            renderCell: (params) => (
              <a
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#90caf9" }}
              >
                Twitter
              </a>
            ),
          },
          {
            field: "companyAddress",
            headerName: "Company Address",
            width: 250,
          },
          { field: "companyCity", headerName: "Company City", width: 150 },
          { field: "companyState", headerName: "Company State", width: 150 },
          { field: "city", headerName: "City", width: 100 },
          { field: "state", headerName: "State", width: 100 },
          { field: "country", headerName: "Country", width: 100 },
          {
            field: "keywords",
            headerName: "Keywords",
            width: 200,
            renderCell: (params) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  color: "white",
                }}
              >
                {Array.isArray(params.value) ? (
                  params.value.map((kw, idx) => (
                    <Chip
                      key={idx}
                      label={kw}
                      size="small"
                      sx={{
                        backgroundColor: "gray",
                        color: "white ",
                        fontSize: "16px",
                      }}
                    />
                  ))
                ) : (
                  <span>No keywords available</span> // Affiche un message si ce n'est pas un tableau
                )}
              </Box>
            ),
          },
          
          { field: "companyNameForEmails", headerName: "Company Name for Emails", width: 200 },
          { field: "companyCountry", headerName: "Company Country", width: 150 },
          { field: "seoDescription", headerName: "SEO Description", width: 250 },
          {
            field: "technologies",
            headerName: "Technologies",
            width: 200,
            renderCell: (params) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  color: "white",
                }}
              >
                {Array.isArray(params.value) ? (
                  params.value.map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech}
                      size="small"
                      sx={{
                        backgroundColor: "gray",
                        color: "white",
                        fontSize: "16px",
                      }}
                    />
                  ))
                ) : (
                  <span>No technologies available</span> // Fallback message
                )}
              </Box>
            ),
          },
          { field: "annualRevenue", headerName: "Annual Revenue", width: 180 },
          { field: "totalFunding", headerName: "Total Funding", width: 180 },
          { field: "latestFunding", headerName: "Latest Funding", width: 180 },
          { field: "latestFundingAmount", headerName: "Latest Funding Amount", width: 200 },
          { field: "lastRaisedAt", headerName: "Last Raised At", width: 180 },
          { field: "primaryEmailSource", headerName: "Primary Email Source", width: 200 },
          { field: "secondaryEmail", headerName: "Secondary Email", width: 200 },
          { field: "secondaryEmailSource", headerName: "Secondary Email Source", width: 200 },
          { field: "tertiaryEmail", headerName: "Tertiary Email", width: 200 },
          { field: "tertiaryEmailSource", headerName: "Tertiary Email Source", width: 200 },
        ]}
        pageSize={10}
        rowHeight={80}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          sorting: {
            sortModel: [{ field: "firstName", sort: "desc" }],
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        sx={{
          fontSize: "18px",
          color: "white",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            color: "#333",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#e0e0e0",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#f5f5f5",
          },
          "& .MuiDataGrid-cell": {
            backgroundColor: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiButtonBase-root": {
            color: "white",
          },
          "& .MuiDataGrid-footerContainer ": {
            color: "black",
          },
          "& .MuiDataGrid-toolbarContainer  ": {
            color: "black",
          },
        }}
      />
    </div>
  );
};

export default ResultsTable;
