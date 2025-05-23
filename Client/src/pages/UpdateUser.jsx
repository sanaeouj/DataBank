import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';

const UpdateUser = () => {
  const [data, setData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const excludedColumns = [
    "personalid",
    "companyid",
    "geoid",
    "revenueid",
    "socialid",
  ];

  const numericFields = [
    "company.employees",
    "revenue.Annual Revenue",
    "revenue.Total Funding",
    "revenue.Latest Funding Amount"
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("https://databank-yndl.onrender.com/api/ressources/all");
      if (Array.isArray(response.data) && response.data.length) {
        const flattenedData = response.data.map(flattenObject).map((item) => {
          if (item["Latest Funding"]) {
            item["Latest Funding"] = new Date(
              item["Latest Funding"]
            ).toLocaleDateString("fr-FR");
          }
          return item;
        });
        setData(flattenedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Impossible de charger les données", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const fullKey = prefix ? key : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], fullKey));
      } else {
        acc[fullKey] = obj[key];
      }
      return acc;
    }, {});
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setUpdatedRow(row);
    setEditDialogOpen(true);
  };

const handleSaveEdit = async () => {
  try {
    const originalData = selectedRow;

    // Prepare the update data structure
    const updateData = {
      personalDetails: {
        firstName: updatedRow["First Name"] || originalData["First Name"],
        lastName: updatedRow["Last Name"] || originalData["Last Name"],
        title: updatedRow["title"] || originalData["title"],
        seniority: updatedRow["seniority"] || originalData["seniority"],
        departments: updatedRow["departments"] || originalData["departments"],
        mobilePhone: updatedRow["mobilePhone"] || originalData["mobilePhone"], 
        email: updatedRow["email"] || originalData["email"],
        EmailStatus: updatedRow["EmailStatus"] || originalData["EmailStatus"],
      },
      companyDetails: {
        company: updatedRow["company.company"] || originalData["company.company"],
        Email: updatedRow["company.Email"] || originalData["company.Email"],
        Phone: updatedRow["company.Phone"] || originalData["company.Phone"],
        employees: updatedRow["company.employees"] 
          ? parseInt(updatedRow["company.employees"]) 
          : originalData["company.employees"],
        industry: updatedRow["company.industry"] || originalData["company.industry"],
        seoDescription: updatedRow["company.SEO Description"] || originalData["company.SEO Description"],
        annualRevenue: updatedRow["company.Annual Revenue"] 
          ? parseInt(updatedRow["company.Annual Revenue"]) 
          : originalData["company.Annual Revenue"],
        totalFunding: updatedRow["company.Total Funding"] 
          ? parseInt(updatedRow["company.Total Funding"]) 
          : originalData["company.Total Funding"],
      },
      geoDetails: {
        address: updatedRow["geo.address"] || originalData["geo.address"],
        city: updatedRow["geo.city"] || originalData["geo.city"],
        state: updatedRow["geo.state"] || originalData["geo.state"],
        country: updatedRow["geo.country"] || originalData["geo.country"],
      },
      revenueDetails: {
        annualRevenue: updatedRow["revenue.Annual Revenue"] 
          ? parseInt(updatedRow["revenue.Annual Revenue"]) 
          : originalData["revenue.Annual Revenue"],
        totalFunding: updatedRow["revenue.Total Funding"] 
          ? parseInt(updatedRow["revenue.Total Funding"]) 
          : originalData["revenue.Total Funding"],
        latestFunding: updatedRow["Latest Funding"] 
          ? new Date(updatedRow["Latest Funding"]).toISOString()
          : originalData["Latest Funding"],
        latestFundingAmount: updatedRow["revenue.Latest Funding Amount"] 
          || originalData["revenue.Latest Funding Amount"],
      },
      socialDetails: {
        linkedinUrl: updatedRow["social.Company Linkedin Url"] 
          || originalData["social.Company Linkedin Url"],
        facebookUrl: updatedRow["social.Facebook Url"] 
          || originalData["social.Facebook Url"],
        twitterUrl: updatedRow["social.Twitter Url"] 
          || originalData["social.Twitter Url"],
      }
    };

    const response = await axios.put(
      `https://databank-f.onrender.com/api/ressources/${originalData["personalid"]}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

     if (response.data && response.data.success) {
      fetchData();
      setEditDialogOpen(false);
      showSnackbar("Mise à jour effectuée avec succès!");
    } else {
      throw new Error(response.data?.error || "Unknown error during update");
    }
  } catch (error) {
    console.error("Update error details:", error.response?.data || error.message);
    let errorMessage = "Échec de la mise à jour";
    
    if (error.response) {
       errorMessage = error.response.data?.details 
        ? `${errorMessage}: ${error.response.data.details}`
        : errorMessage;
    } else {
      errorMessage = `${errorMessage}: ${error.message}`;
    }
    
    showSnackbar(errorMessage, "error");
  }
};

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${row["First Name"]} ${row["Last Name"]}?`)) {
      return;
    }

    try {
      await axios.delete(
        `https://databank-yndl.onrender.com/api/ressources/delete/${row["personalid"]}`
      );
      fetchData();
      showSnackbar("Suppression effectuée avec succès!");
    } catch (error) {
      console.error("Error deleting row:", error);
      showSnackbar(`Échec de la suppression: ${error.response?.data?.error || error.message}`, "error");
    }
  };

  const getColumnsFromData = (data) => {
    if (!data || data.length === 0) return [];
    const columns = Object.keys(data[0])
      .filter((col) => !excludedColumns.includes(col))
      .map((key) => ({
        field: key,
        headerName: key.replace(/([A-Z])/g, " $1").trim(),
        width: 200,
        renderCell: (params) => params.value || "N/A",
      }));

    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleEditClick(params.row)}
            startIcon={<EditIcon />}
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
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
    });
    return columns;
  };

  const handleFilterChange = (e) => {
    setFilterValues({ ...filterValues, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter((user) => {
    return Object.entries(filterValues).every(
      ([key, value]) =>
        !value ||
        (user[key] &&
          user[key].toString().toLowerCase().includes(value.toLowerCase()))
    );
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          backgroundColor: "#1e1e1e",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          User Data
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            padding: 2,
            backgroundColor: "#333",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {getColumnsFromData(data).map(
            (col) =>
              col.field !== "actions" && (
                <TextField
                  key={col.field}
                  label={col.headerName}
                  name={col.field}
                  value={filterValues[col.field] || ""}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                  }}
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                />
              )
          )}
        </Box>
        
        <DataGrid
          rows={filteredData}
          columns={getColumnsFromData(data)}
          getRowId={(row) => row["personalid"] || Math.random()}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          sx={{
          fontSize: "20px",
          height: "100%",
          overflowX: "auto",
          backgroundColor: "#333",
          color: "white",
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

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          disableEnforceFocus
          sx={{ 
            '& .MuiDialog-paper': {
              backgroundColor: "#1e1e1e",
              color: "white",
            }
          }}
        >
          <DialogTitle>Edit Row</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
              {selectedRow && Object.keys(selectedRow)
                .filter((key) => !excludedColumns.includes(key))
                .map((key) => {
                  const isNumeric = numericFields.includes(key);
                  const isDateField = key === "Latest Funding";
                  
                  if (isDateField) {
                    return (
                      <DatePicker
                        key={key}
                        label={key}
                        value={updatedRow[key] ? new Date(updatedRow[key]) : null}
                        onChange={(newValue) => {
                          setUpdatedRow({ 
                            ...updatedRow, 
                            [key]: newValue ? newValue.toISOString() : null 
                          });
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            margin="normal"
                            InputProps={{ style: { color: "white" } }}
                            InputLabelProps={{ style: { color: "white" } }}
                          />
                        )}
                      />
                    );
                  }

                  return (
                    <TextField
                      key={key}
                      label={key}
                      value={updatedRow[key] || ""}
                      onChange={(e) => {
                        const value = isNumeric 
                          ? e.target.value.replace(/[^0-9]/g, '')
                          : e.target.value;
                        setUpdatedRow({ ...updatedRow, [key]: value });
                      }}
                      fullWidth
                      margin="normal"
                      type={isNumeric ? "number" : "text"}
                      InputProps={{ 
                        style: { color: "white" },
                        inputProps: isNumeric ? { min: 0 } : {}
                      }}
                      InputLabelProps={{ style: { color: "white" } }}
                    />
                  );
                })}
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditDialogOpen(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default UpdateUser;