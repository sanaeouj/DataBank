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

  // Les colonnes à masquer (tous les ID)
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

  // Aplatir tous les objets et sous-objets pour que chaque attribut soit une colonne
  const flattenData = (data) =>
  data.map((item) => {
    const flatten = (obj, prefix = "") => {
      let result = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}_${key}` : key;
          if (
            obj[key] &&
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key])
          ) {
            Object.assign(result, flatten(obj[key], fullKey));
          } else {
             result[fullKey] = obj[key] !== null && obj[key] !== undefined ? obj[key] : "";
          }
        }
      }
      return result;
    };
    return flatten(item);
  });

  // Générer dynamiquement toutes les colonnes à partir des données aplanies
  const getColumnsFromData = (data) => {
    if (!data || !data.length) return [];
    const columns = [];
    const headerMapping = {
      "First Name": "Prénom",
      "Last Name": "Nom",
      "mobilePhone": "Téléphone mobile",
      "EmailStatus": "Statut Email",
      "company_company": "Entreprise",
      "company_Email": "Email Entreprise",
      "company_Phone": "Téléphone Entreprise",
      "company_employees": "Employés",
      "company_industry": "Industrie",
      "company_SEO Description": "Description SEO",
      "geo_address": "Adresse",
      "geo_city": "Ville",
      "geo_state": "État/Région",
      "geo_country": "Pays",
      "social_Company Linkedin Url": "LinkedIn",
      "social_Facebook Url": "Facebook",
      "social_Twitter Url": "Twitter",
      "revenue_Annual Revenue": "Revenu Annuel",
      "revenue_Total Funding": "Financement Total",
      "revenue_Latest Funding Amount": "Montant dernier financement",
      "revenue_Latest Funding": "Date dernier financement",
    };

    const sampleItem = flattenData([data[0]])[0];
    for (const key in sampleItem) {
      if (!hiddenColumns.some(hc => key.includes(hc))) {
        columns.push({
          field: key,
          headerName: headerMapping[key] ||
            key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          width: 200,
          renderCell: (params) => {
            if (key === "revenue_Latest Funding") {
              return formatDate(params.value);
            } else if (key.includes("Url")) {
              return params.value ? (
                <a
                  href={
                    params.value.startsWith("http://") ||
                    params.value.startsWith("https://")
                      ? params.value
                      : `https://${params.value}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#90caf9" }}
                >
                  Lien
                </a>
              ) : "";
            }
            return params.value || "";
          }
        });
      }
    }
    return columns;
  };

  useEffect(() => {
    const applyFilters = () => {
      if (!data || !data.length) return [];
      return flattenData(data).filter((row) => {
        return Object.entries(filterValues).every(([key, value]) => {
          if (!value) return true;
          const cellValue = row[key]?.toString().toLowerCase() || "";
          return cellValue.includes(value.toLowerCase());
        });
      });
    };
    setFilteredData(applyFilters());
  }, [data, filterValues]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleEditClick = (row) => {
    setCurrentRow(row);
    const formData = {
      personalDetails: {
        firstName: row['First Name'] || '',
        lastName: row['Last Name'] || '', 
        title: row.title || "",
        seniority: row.seniority || "",
        departments: row.departments || "",
        mobilePhone: row.mobilePhone || "",
        email: row.email || "",
        EmailStatus: row.EmailStatus || "",
      },
      companyDetails: {
        company: row.companycompany || "",
        email: row.companyEmail || "",
        phone: row.companyPhone || "",
        employees: row.companyemployees ? row.companyemployees.toString() : "",
        industry: row.companyindustry || "",
        seoDescription: row['companySEO Description'] || "",  
      },
      geoDetails: {
        address: row.geoaddress || "",
        city: row.geocity || "",
        state: row.geostate || "",
        country: row.geocountry || "",
      },
      revenueDetails: {
        latestFunding: row['revenueLatest Funding'] ? formatDateForInput(row['revenueLatest Funding']) : "",
        latestFundingAmount: row['revenueLatest Funding Amount'] ? row['revenueLatest Funding Amount'].toString() : "", 
      },
      socialDetails: {
        linkedinUrl: row['socialCompany Linkedin Url'] || '',
        facebookUrl: row['socialFacebook Url'] || '',
        twitterUrl: row['socialTwitter Url'] || '',
      },
    };
    setEditFormData(formData);
    setEditDialogOpen(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  };

  const handleUpdateRow = async () => {
    try {
      if (!currentRow || !currentRow.personalid) {
        throw new Error("No row selected for update");
      }
      const updateData = {
        personalDetails: {
          firstName: editFormData.personalDetails.firstName || '',
          lastName: editFormData.personalDetails.lastName || '',
          title: editFormData.personalDetails.title || '',
          seniority: editFormData.personalDetails.seniority || '',
          departments: editFormData.personalDetails.departments || '',
          mobilePhone: editFormData.personalDetails.mobilePhone || '',
          email: editFormData.personalDetails.email || '',
          EmailStatus: editFormData.personalDetails.EmailStatus || '',
        },
        companyDetails: {
          company: editFormData.companyDetails.company || '',
          email: editFormData.companyDetails.email || '',
          phone: editFormData.companyDetails.phone || '',
          employees: editFormData.companyDetails.employees || '',
          industry: editFormData.companyDetails.industry || '',
          seoDescription: editFormData.companyDetails.seoDescription || '',
        },
        geoDetails: {
          address: editFormData.geoDetails.address || '',
          city: editFormData.geoDetails.city || '',
          state: editFormData.geoDetails.state || '',
          country: editFormData.geoDetails.country || '',
        },
        revenueDetails: {
          latestFunding: editFormData.revenueDetails.latestFunding || null,
          latestFundingAmount: editFormData.revenueDetails.latestFundingAmount || '',
        },
        socialDetails: {
          linkedinUrl: editFormData.socialDetails.linkedinUrl || '',
          facebookUrl: editFormData.socialDetails.facebookUrl || '',
          twitterUrl: editFormData.socialDetails.twitterUrl || '',
        }
      };
      await axios.put(
        `https://databank-yndl.onrender.com/api/ressources/update/${currentRow.personalid}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const updatedData = filteredData.map((row) => {
        if (row.personalid === currentRow.personalid) {
          return {
            ...row,
            'First Name': updateData.personalDetails.firstName,
            'Last Name': updateData.personalDetails.lastName,
            title: updateData.personalDetails.title,
            seniority: updateData.personalDetails.seniority,
            departments: updateData.personalDetails.departments,
            mobilePhone: updateData.personalDetails.mobilePhone,
            email: updateData.personalDetails.email,
            EmailStatus: updateData.personalDetails.EmailStatus,
            companycompany: updateData.companyDetails.company,
            companyEmail: updateData.companyDetails.email,
            companyPhone: updateData.companyDetails.phone,
            companyemployees: updateData.companyDetails.employees,
            companyindustry: updateData.companyDetails.industry,
            'companySEO Description': updateData.companyDetails.seoDescription,
            geoaddress: updateData.geoDetails.address,
            geocity: updateData.geoDetails.city,
            geostate: updateData.geoDetails.state,
            geocountry: updateData.geoDetails.country,
            'revenueLatest Funding': updateData.revenueDetails.latestFunding,
            'revenueLatest Funding Amount': updateData.revenueDetails.latestFundingAmount,
            'socialCompany Linkedin Url': updateData.socialDetails.linkedinUrl,
            'socialFacebook Url': updateData.socialDetails.facebookUrl,
            'socialTwitter Url': updateData.socialDetails.twitterUrl,
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
      } else {
        errorMessage = error.message;
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
      await axios.delete(`https://databank-yndl.onrender.com/api/ressources/delete/${row.personalid}`);
      setFilteredData((prev) => prev.filter((item) => item.personalid !== row.personalid));
      setSnackbar({
        open: true,
        message: "Row deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete row.",
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

  const SettingsDialog = () => (
    <Dialog
      open={settingsDialogOpen}
      onClose={() => setSettingsDialogOpen(false)}
      sx={{ backgroundColor: "#333", color: "white" }}
    >
      <DialogTitle style={{ backgroundColor: "#333", color: "white" }}>
        Filter
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
    ...getColumnsFromData(data).filter((col) => {
      const visibleCol = visibleColumns.find((vCol) => vCol.field === col.field);
      return visibleCol ? visibleCol.visible : true;
    }),
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
          Total Filter: {filteredData.length}
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
            displayedColumns.reduce((total, col) => total + (col.width || 200), 0),
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
          "& .MuiDataGrid-filler": {
            backgroundColor: "#1e1e1e",
            color: "white",
          },
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
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