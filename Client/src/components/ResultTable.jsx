import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Menu,
  MenuItem,
  Button,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const ResultTable = ({ data = [], filters }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const hiddenColumns = [
    "personalid",
    "companycompanyid",
    "companypersonalid",
    "geogeoid",
    "geocompanyid",
    "revenuerevenueid",
    "revenuecompanyid",
    "socialcompanyid",
    "socialsocialid",
  ];

  useEffect(() => {
    if (visibleColumns.length === 0) {
      setVisibleColumns(
        getColumnsFromData(data).map((col) => ({
          field: col.field,
          visible: true,
        }))
      );
    }
  }, [data]);

  const getColumnsFromData = (data) => {
    console.log("data", data);
    if (!data || !data.length) return [];
    const columns = [];
    const headerMapping = {
      mobilePhone: "Mobile Phone",
      EmailStatus: "Email Status",
      "company.company": "Company",
      "company.email": "Company Email",
      "company.phone": "Company Phone",
      "company.employees": "Company Employees",
      "company.industry": "Industry",
      "company.SEO Description": "SEO Description",
      "company.Annual Revenue": "Annual Revenue",
      "company.Total Funding": "Total Funding",
      "geo.address": "Address",
      "geo.city": "City",
      "geo.state": "State",
      "geo.country": "Country",
      "social.Company Linkedin Url": "LinkedIn",
      "social.Facebook Url": "Facebook",
      "social.Twitter Url": "Twitter",
      "revenue.Total Funding": "Total Funding",
      "revenue.Annual Revenue": "Annual Revenue",
      "revenue.Latest Funding Amount": "Latest Funding Amount",
    };

    const extractFields = (obj, prefix = "") => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;

          if (!hiddenColumns.includes(fullKey.replace(/\./g, ""))) {
            if (
              typeof obj[key] === "object" &&
              obj[key] !== null &&
              !Array.isArray(obj[key])
            ) {
              extractFields(obj[key], fullKey);
            } else {
              columns.push({
                field: fullKey.replace(/\./g, ""),
                headerName:
                  headerMapping[fullKey] ||
                  fullKey
                    .split(".")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                width: 200,
                renderCell: (params) =>
                  /Url$/i.test(fullKey) ? (
                    <a
                      href={params.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#90caf9" }}
                    >
                      {params.value ? "Link" : ""}
                    </a>
                  ) : (
                    params.value || "N/A"
                  ),
              });
            }
          }
        }
      }
    };

    extractFields(data[0]);
    return columns;
  };
  const calculateTableWidth = () => {
    const totalWidth = visibleColumns
      .filter((col) => col.visible)
      .reduce((totalWidth, col) => totalWidth + (col.width || 200), 0);

    return Math.max(totalWidth, window.innerWidth);
  };
  const flattenData = (data) =>
    data.map((item) => {
      const flatten = (obj, prefix = "") => {
        let result = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (
              obj[key] &&
              typeof obj[key] === "object" &&
              !Array.isArray(obj[key])
            ) {
              Object.assign(result, flatten(obj[key], fullKey));
            } else {
              result[fullKey.replace(/\./g, "")] =
                obj[key] !== undefined ? obj[key] : "N/A";
            }
          }
        }
        return result;
      };
      return flatten(item);
    });

  const filteredData = flattenData(data).filter((row) => {
    return Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;

      const itemValue = key.includes(".")
        ? key.split(".").reduce((acc, part) => acc?.[part], row)
        : row[key];

      return itemValue
        ? itemValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    });
  });

  const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }

    const headers = Object.keys(filteredData[0]).filter(
      (key) => !hiddenColumns.includes(key)
    );

    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const cellData = (row[header] || "").toString().replace(/"/g, '""');
            return `"${cellData}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, "ResultsTable_Export.csv");
    } else {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "ResultsTable_Export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToExcel = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }

    const filteredExportData = filteredData.map((row) => {
      const newRow = {};
      Object.entries(row).forEach(([key, value]) => {
        if (!hiddenColumns.includes(key)) {
          newRow[key] = value;
        }
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "ResultsTable_Export.xlsx");
  };

  const CustomToolbar = () => {
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    return (
      
      <Toolbar
        style={{
          backgroundColor: "#242424",
          marginBottom: "12px",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Data Table
        </Typography>
        <Button
          onClick={(e) => setExportMenuAnchorEl(e.currentTarget)}
          startIcon={<DownloadIcon />}
          style={{ color: "white" }}
        >
          Export
        </Button>
        <Menu
          anchorEl={exportMenuAnchorEl}
          open={Boolean(exportMenuAnchorEl)}
          onClose={() => setExportMenuAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              exportToCSV();
              setExportMenuAnchorEl(null);
            }}
          >
            Download as CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel();
              setExportMenuAnchorEl(null);
            }}
          >
            Download as Excel
          </MenuItem>
        </Menu>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setSettingsDialogOpen(true)}
          style={{ color: "white" }}
        >
          Filter
        </Button>
      </Toolbar>
    );
  };

  const SettingsDialog = () => (
    <Dialog
      open={settingsDialogOpen}
      onClose={() => setSettingsDialogOpen(false)}
      sx={{ backgroundColor: "#242424", color: "white" }}
    >
      <DialogTitle style={{ backgroundColor: "#242424", color: "white" }}>
        Filter
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#242424", color: "white" }}>
        {getColumnsFromData(data).map((col) => {
          const visibleCol = visibleColumns.find(
            (vCol) => vCol.field === col.field
          );
          return (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={visibleCol?.visible || false}
                  onChange={() =>
                    setVisibleColumns((prev) =>
                      prev.map((vCol) =>
                        vCol.field === col.field
                          ? { ...vCol, visible: !vCol.visible }
                          : vCol
                      )
                    )
                  }
                  style={{ color: "white" }}
                />
              }
              label={col.headerName}
            />
          );
        })}
      </DialogContent>
      <DialogActions style={{ backgroundColor: "#242424", color: "white" }}>
        <Button
          onClick={() => setSettingsDialogOpen(false)}
          style={{ color: "white" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const displayedColumns = getColumnsFromData(data).filter((col) => {
    const visibleCol = visibleColumns.find((vCol) => vCol.field === col.field);
    return visibleCol ? visibleCol.visible : true;
  });
  return (
    <div
      style={{
        height: "100",
        overflowX: "auto",
        backgroundColor: "#242424",
        color: "white",
      }}
    >
      <CustomToolbar />

      <DataGrid
        rows={filteredData}
        columns={displayedColumns}
        getRowId={(row) => row.personalid || Math.random()}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          fontSize: "20px",
          height: "100%",
          overflowX: "auto",
          backgroundColor: "#242424",
          color: "white",
          width: `${calculateTableWidth()}px`,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#242424",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": { backgroundColor: "#242424", color: "white" },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-filler": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-cell:hover": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-footerCell": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#242424",
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
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiTablePagination-menuItem.selected": {
            backgroundColor: "#242424",
            color: "white",
          },
          "& .MuiDataGrid-cell": {
            backgroundColor: "#242424",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
        }}
      />
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        sx={{ backgroundColor: "#242424", color: "white" }}
      >
        <DialogTitle style={{ backgroundColor: "#242424", color: "white" }}>
          Filter Data
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#242424", color: "white" }}>
          {displayedColumns.map((col) => (
            <TextField
              key={col.field}
              label={col.headerName}
              value={filterValues[col.field] || ""}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  [col.field]: e.target.value,
                }))
              }
              fullWidth
              margin="dense"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
              style={{ backgroundColor: "#242424" }}
            />
          ))}
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#242424", color: "white" }}>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            style={{ color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <SettingsDialog style={{ backgroundColor: "#242424", color: "white" }} />
    </div>
  );
};

export default ResultTable;
