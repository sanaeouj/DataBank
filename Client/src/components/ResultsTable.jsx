import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { Menu, MenuItem, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { BiExport } from 'react-icons/bi';

const ResultsTable = ({ data = [], filters = {} }) => {
   const getColumnsFromData = (data) => {
    if (!data.length) return [];
    const firstDataItem = data[0];
    const columns = [];
    
    const extractFields = (obj, prefix = '') => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            extractFields(obj[key], fullKey);
          } else {
            columns.push({
              field: fullKey.replace(/\./g, ''),
              headerName: fullKey.split('.').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              width: 150,
              renderCell: (params) => {
                if (/Url$/i.test(fullKey)) {
                  return (
                    <a
                      href={params.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#90caf9" }}
                    >
                      {params.value ? "Link" : ""}
                    </a>
                  );
                }
                return params.value !== null && params.value !== undefined ? String(params.value) : '';
              },
            });
          }
        }
      }
    };
    extractFields(firstDataItem);
    return columns;
  };

  const columns = getColumnsFromData(data);

  // Flatten the data structure
  const flattenData = (item) => {
    const flatten = (obj, prefix = '') => {
      let result = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(result, flatten(obj[key], fullKey));
          } else {
            result[fullKey.replace(/\./g, '')] = obj[key] !== null && obj[key] !== undefined ? String(obj[key]) : '';
          }
        }
      }
      return result;
    };
    return flatten(item);
  };
  const flattenedData = data.map(flattenData);

  // Filter the data based on provided filters
  const filteredData = flattenedData.filter((row) =>
    Object.entries(filters).every(([key, value]) => !value || row[key] === value)
  );

   const exportToExcel = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "ResultsTable_Export.xlsx");
  };

   const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => headers.map((header) => `"${row[header] !== undefined && row[header] !== null ? String(row[header]).replace(/"/g, '""') : ""}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ResultsTable_Export.csv";
    link.click();
  };

  // Custom toolbar component
  const CustomToolbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button onClick={handleMenuOpen} style={{ color: "black" }}>
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
        height: "100%",
        width: "100%",
        overflowX: "auto",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <DataGrid
        rows={filteredData}
        columns={columns}
        getRowId={(row) => row.personalid || Math.random()}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          sorting: {
            sortModel: [{ field: "firstname", sort: "asc" }],
          },
        }}
        components={{
          Toolbar: CustomToolbar,
        }}
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