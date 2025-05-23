import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import CustomToolbar from "./CustomToolbar";
import EditDialog from "./EditDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const headerMapping = {
  "First Name": "First Name",
  "Last Name": "Last Name",
  "title": "Title",
  "seniority": "Seniority",
  "departments": "Departments",
  "mobilePhone": "Mobile Phone",
  "email": "Email",
  "EmailStatus": "Email Status",
  "company.company": "Company",
  "company.email": "Company Email",
  "company.phone": "Company Phone",
  "company.employees": "Company Employees",
  "company.industry": "Industry",
  "company.SEO Description": "SEO Description",
  "geo.city": "City",
  "geo.address": "Address",
  "geo.state": "State",
  "geo.country": "Country",
  "revenue.Annual Revenue": "Annual Revenue",
  "revenue.Total Funding": "Total Funding",
  "revenue.Latest Funding": "Latest Funding",
  "revenue.Latest Funding Amount": "Latest Funding Amount",
  "social.Company Linkedin Url": "LinkedIn",
  "social.Facebook Url": "Facebook",
  "social.Twitter Url": "Twitter",
};

const hiddenColumns = [
  "personalid",
  "companyid",
  "geoid",
  "revenueid",
  "socialid",
  "company.personalid",
  "company.companyid",
  "geo.geoid",
  "geo.companyid",
  "revenue.revenueid",
  "revenue.companyid",
  "social.companyid",
  "social.socialid",
];

const ResultsTable = ({ data = [], filters }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [savedFilters, setSavedFilters] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [editFormData, setEditFormData] = useState({
    personalDetails: {},
    companyDetails: {},
    geoDetails: {},
    revenueDetails: {},
    socialDetails: {},
  });

  // Flatten data structure
  const flattenData = (data) => {
    return data.map((item) => {
      const flattenObject = (obj, prefix = "") => {
        return Object.keys(obj).reduce((acc, key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            Object.assign(acc, flattenObject(obj[key], fullKey));
          } else {
            acc[fullKey] = obj[key] !== undefined ? obj[key] : "N/A";
          }
          return acc;
        }, {});
      };
      return flattenObject(item);
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  // Get columns from flattened data
  const getColumnsFromData = (data) => {
    if (!data || !data.length) return [];
    
    // Get sample flattened item to extract all possible columns
    const sampleItem = flattenData([data[0]])[0];
    const allKeys = Object.keys(sampleItem).filter(
      (key) => !hiddenColumns.includes(key)
    );

    return allKeys.map((key) => ({
      field: key,
      headerName:
        headerMapping[key] ||
        key
          .split(".")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      width: 200,
      renderCell: (params) => {
        if (params.value === undefined || params.value === null) return "N/A";
        
        if (key.includes("Latest Funding") && !key.includes("Amount")) {
          return formatDate(params.value);
        } else if (/Url$/i.test(key)) {
          return params.value ? (
            <a
              href={
                params.value.startsWith("http")
                  ? params.value
                  : `https://${params.value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#90caf9" }}
            >
              Link
            </a>
          ) : "N/A";
        }
        return params.value || "N/A";
      },
    }));
  };

  // Apply filters to data
  useEffect(() => {
    const applyFilters = () => {
      if (!data || !data.length) return [];
      
      const flattened = flattenData(data);
      return flattened.filter((row) => {
        return Object.entries(filterValues).every(([key, value]) => {
          if (!value) return true;
          const cellValue = row[key]?.toString().toLowerCase() || "";
          return cellValue.includes(value.toLowerCase());
        });
      });
    };
    
    setFilteredData(applyFilters());
  }, [data, filterValues]);

  // Initialize visible columns
  useEffect(() => {
    if (data && data.length) {
      const columns = getColumnsFromData(data);
      setVisibleColumns(
        columns.map((col) => ({
          ...col,
          visible: true,
        }))
      );
    }
  }, [data]);

  // Handle edit click
  const handleEditClick = (row) => {
    setCurrentRow(row);
    const formData = {
      personalDetails: {
        firstName: row["First Name"] || "",
        lastName: row["Last Name"] || "",
        title: row["title"] || "",
        seniority: row["seniority"] || "",
        departments: row["departments"] || "",
        mobilePhone: row["mobilePhone"] || "",
        email: row["email"] || "",
        EmailStatus: row["EmailStatus"] || "",
      },
      companyDetails: {
        company: row["company.company"] || "",
        email: row["company.email"] || "",
        phone: row["company.phone"] || "",
        employees: row["company.employees"] ? row["company.employees"].toString() : "",
        industry: row["company.industry"] || "",
        seoDescription: row["company.SEO Description"] || "",
      },
      geoDetails: {
        address: row["geo.address"] || "",
        city: row["geo.city"] || "",
        state: row["geo.state"] || "",
        country: row["geo.country"] || "",
      },
      revenueDetails: {
        latestFunding: row["revenue.Latest Funding"]
          ? formatDateForInput(row["revenue.Latest Funding"])
          : "",
        latestFundingAmount: row["revenue.Latest Funding Amount"]
          ? row["revenue.Latest Funding Amount"].toString()
          : "",
      },
      socialDetails: {
        linkedinUrl: row["social.Company Linkedin Url"] || "",
        facebookUrl: row["social.Facebook Url"] || "",
        twitterUrl: row["social.Twitter Url"] || "",
      },
    };
    setEditFormData(formData);
    setEditDialogOpen(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleUpdateRow = async () => {
    try {
      if (!currentRow || !currentRow.personalid) {
        throw new Error("No row selected for update");
      }

      const updateData = {
        personalDetails: {
          firstName: editFormData.personalDetails.firstName || "",
          lastName: editFormData.personalDetails.lastName || "",
          title: editFormData.personalDetails.title || "",
          seniority: editFormData.personalDetails.seniority || "",
          departments: editFormData.personalDetails.departments || "",
          mobilePhone: editFormData.personalDetails.mobilePhone || "",
          email: editFormData.personalDetails.email || "",
          EmailStatus: editFormData.personalDetails.EmailStatus || "",
        },
        companyDetails: {
          company: editFormData.companyDetails.company || "",
          email: editFormData.companyDetails.email || "",
          phone: editFormData.companyDetails.phone || "",
          employees: editFormData.companyDetails.employees || "",
          industry: editFormData.companyDetails.industry || "",
          seoDescription: editFormData.companyDetails.seoDescription || "",
        },
        geoDetails: {
          address: editFormData.geoDetails.address || "",
          city: editFormData.geoDetails.city || "",
          state: editFormData.geoDetails.state || "",
          country: editFormData.geoDetails.country || "",
        },
        revenueDetails: {
          latestFunding: editFormData.revenueDetails.latestFunding || null,
          latestFundingAmount: editFormData.revenueDetails.latestFundingAmount || "",
        },
        socialDetails: {
          linkedinUrl: editFormData.socialDetails.linkedinUrl || "",
          facebookUrl: editFormData.socialDetails.facebookUrl || "",
          twitterUrl: editFormData.socialDetails.twitterUrl || "",
        },
      };

      const response = await axios.put(
        `https://databank-yndl.onrender.com/api/ressources/update/${currentRow.personalid}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedData = filteredData.map((row) => {
        if (row.personalid === currentRow.personalid) {
          return {
            ...row,
            "First Name": updateData.personalDetails.firstName,
            "Last Name": updateData.personalDetails.lastName,
            title: updateData.personalDetails.title,
            seniority: updateData.personalDetails.seniority,
            departments: updateData.personalDetails.departments,
            mobilePhone: updateData.personalDetails.mobilePhone,
            email: updateData.personalDetails.email,
            EmailStatus: updateData.personalDetails.EmailStatus,
            
            "company.company": updateData.companyDetails.company,
            "company.email": updateData.companyDetails.email,
            "company.phone": updateData.companyDetails.phone,
            "company.employees": updateData.companyDetails.employees,
            "company.industry": updateData.companyDetails.industry,
            "company.SEO Description": updateData.companyDetails.seoDescription,
            
            "geo.address": updateData.geoDetails.address,
            "geo.city": updateData.geoDetails.city,
            "geo.state": updateData.geoDetails.state,
            "geo.country": updateData.geoDetails.country,
            
            "revenue.Latest Funding": updateData.revenueDetails.latestFunding,
            "revenue.Latest Funding Amount": updateData.revenueDetails.latestFundingAmount,
            
            "social.Company Linkedin Url": updateData.socialDetails.linkedinUrl,
            "social.Facebook Url": updateData.socialDetails.facebookUrl,
            "social.Twitter Url": updateData.socialDetails.twitterUrl,
          };
        }
        return row;
      });

      setFilteredData(updatedData);
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Mise à jour réussie !",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      
      let errorMessage = "Échec de la mise à jour";
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        errorMessage = "Pas de réponse du serveur";
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this row?`)) {
      return;
    }
    try {
      await axios.delete(
        `https://databank-yndl.onrender.com/api/ressources/delete/${row.personalid}`
      );
      setFilteredData((prev) =>
        prev.filter((item) => item.personalid !== row.personalid)
      );
      setSnackbar({
        open: true,
        message: "Row deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting row:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete row.",
        severity: "error",
      });
    }
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(filteredData[0]).filter(
      (key) => !hiddenColumns.includes(key)
    );
    const csvContent = [
      headers.map((key) => headerMapping[key] || key).join(","),
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
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "ResultsTable_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(filteredData[0]).filter(
      (key) => !hiddenColumns.includes(key)
    );
    const filteredExportData = filteredData.map((row) => {
      const newRow = {};
      headers.forEach((key) => {
        newRow[headerMapping[key] || key] = row[key];
      });
      return newRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "ResultsTable_Export.xlsx");
  };

  const SettingsDialog = () => (
    <Dialog
      open={settingsDialogOpen}
      onClose={() => setSettingsDialogOpen(false)}
      sx={{ backgroundColor: "#333", color: "white" }}
    >
      <DialogTitle style={{ backgroundColor: "#333", color: "white" }}>
        Column Visibility
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#333", color: "white" }}>
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
      <DialogActions style={{ backgroundColor: "#333", color: "white" }}>
        <Button
          onClick={() => setSettingsDialogOpen(false)}
          style={{ color: "white" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const displayedColumns = [
    ...(visibleColumns.length
      ? visibleColumns.filter((col) => col.visible)
      : getColumnsFromData(data)),
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            onClick={() => handleEditClick(params.row)}
            startIcon={<EditIcon />}
            variant="contained"
            color="primary"
            size="small"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteRow(params.row)}
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "90vh",
        overflowX: "auto",
        backgroundColor: "#333",
        color: "white",
      }}
    >
      <CustomToolbar
        exportToCSV={exportToCSV}
        exportToExcel={exportToExcel}
        setSettingsDialogOpen={setSettingsDialogOpen}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
        }}
      >
        {displayedColumns
          .filter((col) => col.field !== "actions")
          .map((col) => (
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
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                minWidth: "150px",
              }}
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#1e1e1e",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        <Typography variant="body1" sx={{ color: "white" }}>
          Total Records: {filteredData.length}
        </Typography>
      </Box>
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
          backgroundColor: "#333",
          color: "white",
          width: `${Math.max(
            displayedColumns.reduce(
              (total, col) => total + (col.width || 200),
              0
            ),
            window.innerWidth
          )}px`,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#333",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#1e1e1e",
            color: "white",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#1e1e1e",
            color: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#1e1e1e",
            color: "white",
          },
          "& .MuiDataGrid-cell": {
            backgroundColor: "#1e1e1e",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "white",
            textAlign: "center",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <SettingsDialog />
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleUpdateRow={handleUpdateRow}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ResultsTable;