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
    if (!data.length) return [];
    const columns = [];

    const extractFields = (obj, prefix = "") => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (!hiddenColumns.includes(fullKey.replace(/\./g, ""))) {
            if (
              obj[key] &&
              typeof obj[key] === "object" &&
              !Array.isArray(obj[key])
            ) {
              extractFields(obj[key], fullKey);
            } else {
              const customHeaderNames = {
                companycompany: "Company",
                "companyCompany Email": "Company Email",
                "companyCompany Phone": "Company Phone",
                "SEO Description": "SEO Description",
                geoaddress: "Address",
                geocity: "City",
                geostate: "State",
                geocountry: "Country",
                geolocation: "Location",
              };
              columns.push({
                field: fullKey.replace(/\./g, ""),
                headerName:
                  customHeaderNames[fullKey.replace(/\./g, "").toLowerCase()] ||
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
                    params.value || ""
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
              result[fullKey.replace(/\./g, "")] = obj[key] || "";
            }
          }
        }
        return result;
      };
      return flatten(item);
    });

  const filteredData = flattenData(data).filter((row) =>
    Object.entries(filterValues).every(
      ([key, value]) =>
        !value || row[key].toLowerCase().includes(value.toLowerCase())
    )
  );

  const exportToExcel = () => {
    if (!filteredData.length) return alert("No data to export.");
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
      ...filteredData.map((row) =>
        headers
          .map(
            (header) =>
              `"${(row[header] || "").toString().replace(/"/g, '""')}"`
          )
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

  const CustomToolbar = () => {
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    return (
      <Toolbar
        style={{
          backgroundColor: "black",
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
      sx={{ backgroundColor: "black", color: "white" }}
    >
      <DialogTitle style={{ backgroundColor: "black", color: "white" }}>
        Filter
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "black", color: "white" }}>
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
      <DialogActions style={{ backgroundColor: "black", color: "white" }}>
        <Button
          onClick={() => setSettingsDialogOpen(false)}
          style={{ color: "white" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const displayedColumns = getColumnsFromData(data).filter(
    (col) => visibleColumns.find((vCol) => vCol.field === col.field)?.visible
  );

  return (
    <div
      style={{
        height: "100",
        overflowX: "auto",
        backgroundColor: "black",
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
          backgroundColor: "black",
          color: "white",
          width: `${calculateTableWidth()}px`,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": { backgroundColor: "black", color: "white" },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "black",
            color: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "black",
            color: "white",
          },
          "& .MuiDataGrid-filler": { backgroundColor: "black", color: "white" },
          "& .MuiDataGrid-cell:hover": {
            backgroundColor: "black",
            color: "white",
          },
          "& .MuiDataGrid-footerCell": {
            backgroundColor: "black",
            color: "white",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "black",
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
            backgroundColor: "black",
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
        sx={{ backgroundColor: "black", color: "white" }}
      >
        <DialogTitle style={{ backgroundColor: "black", color: "white" }}>
          Filter Data
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "black", color: "white" }}>
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
              style={{ backgroundColor: "black" }}
            />
          ))}
        </DialogContent>
        <DialogActions style={{ backgroundColor: "black", color: "white" }}>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            style={{ color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <SettingsDialog style={{ backgroundColor: "black", color: "white" }} />
    </div>
  );
};

export default ResultTable;
