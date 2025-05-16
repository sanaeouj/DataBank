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
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import axios from "axios";

const ResultTable = ({ data = [], filters }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
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

  const getColumnsFromData = (data) => {
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
      "revenue.Latest Funding": "Latest Funding",
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
                  fullKey === "revenue.Latest Funding" ? (
                    formatDate(params.value)
                  ) : /Url$/i.test(fullKey) ? (
                    <a
                      href={
                        params.value.startsWith("http://") ||
                        params.value.startsWith("https://")
                          ? params.value
                          : `http://${params.value}`
                      }
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
      employees: row.companyemployees || "",
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
      latestFunding: row.revenueLatestFunding || "",
      latestFundingAmount: row.latestFunding || "", 
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
  

const handleUpdateRow = async () => {
  try {
     const updateData = {
      id: currentRow.personalid,
      personalDetails: {
        firstName: editFormData.personalDetails.firstName,
        lastName: editFormData.personalDetails.lastName,
        title: editFormData.personalDetails.title,
        seniority: editFormData.personalDetails.seniority,
        departments: editFormData.personalDetails.departments,
        mobilePhone: editFormData.personalDetails.mobilePhone,
        email: editFormData.personalDetails.email,
        EmailStatus: editFormData.personalDetails.EmailStatus,
      },
      companyDetails: {
        company: editFormData.companyDetails.company,
        email: editFormData.companyDetails.email,
        phone: editFormData.companyDetails.phone,
        employees: editFormData.companyDetails.employees,
        industry: editFormData.companyDetails.industry,
        seoDescription: editFormData.companyDetails.seoDescription,  
      },
      geoDetails: {
        address: editFormData.geoDetails.address,
        city: editFormData.geoDetails.city,
        state: editFormData.geoDetails.state,
        country: editFormData.geoDetails.country,
      },
      revenueDetails: {
        latestFunding: editFormData.revenueDetails.latestFunding,
        latestFundingAmount: editFormData.revenueDetails.latestFundingAmount,
      },
      socialDetails: {
        linkedinUrl: editFormData.socialDetails.linkedinUrl,
        facebookUrl: editFormData.socialDetails.facebookUrl,
        twitterUrl: editFormData.socialDetails.twitterUrl,
      }
    };

 
     const response = await axios.put(
      "http://localhost:3000/api/ressources/update",
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
          
           revenueLatestFunding: updateData.revenueDetails.latestFunding,
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
     
     setSnackbar({
      open: true,
      message: error.response?.data?.message || "Échec de la mise à jour",
      severity: "error",
    });
  }
};

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this row?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/ressources/delete/${row.personalid}`);
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

  const CustomToolbar = () => {
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    return (
      <Toolbar
        style={{
          backgroundColor: "#333",
          marginBottom: "12px",
          color: "white",
          justifyContent: "flex-start",
        }}
      >
        <Button
          onClick={(e) => setExportMenuAnchorEl(e.currentTarget)}
          startIcon={<DownloadIcon />}
          style={{ color: "white", marginRight: "16px" }}
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

  const EditDialog = () => (
    <Dialog
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{ backgroundColor: "#333", color: "white" }}>
        Edit Row
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#333", padding: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            Personal Details
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="First Name"
              value={editFormData.personalDetails.firstName || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  personalDetails: {
                    ...editFormData.personalDetails,
                    firstName: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Last Name"
              value={editFormData.personalDetails.lastName || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  personalDetails: {
                    ...editFormData.personalDetails,
                    lastName: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Title"
              value={editFormData.personalDetails.title || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  personalDetails: {
                    ...editFormData.personalDetails,
                    title: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Mobile Phone"
              value={editFormData.personalDetails.mobilePhone || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  personalDetails: {
                    ...editFormData.personalDetails,
                    mobilePhone: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Email"
              value={editFormData.personalDetails.email || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  personalDetails: {
                    ...editFormData.personalDetails,
                    email: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <Typography variant="h6" sx={{ color: "white" }}>
            Company Details
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Company Name"
              value={editFormData.companyDetails.company || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  companyDetails: {
                    ...editFormData.companyDetails,
                    company: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Company Email"
              value={editFormData.companyDetails.email || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  companyDetails: {
                    ...editFormData.companyDetails,
                    email: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Company Phone"
              value={editFormData.companyDetails.phone || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  companyDetails: {
                    ...editFormData.companyDetails,
                    phone: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Employees"
              value={editFormData.companyDetails.employees || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  companyDetails: {
                    ...editFormData.companyDetails,
                    employees: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <Typography variant="h6" sx={{ color: "white" }}>
            Location Details
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Address"
              value={editFormData.geoDetails.address || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  geoDetails: {
                    ...editFormData.geoDetails,
                    address: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="City"
              value={editFormData.geoDetails.city || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  geoDetails: {
                    ...editFormData.geoDetails,
                    city: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="State"
              value={editFormData.geoDetails.state || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  geoDetails: {
                    ...editFormData.geoDetails,
                    state: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Country"
              value={editFormData.geoDetails.country || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  geoDetails: {
                    ...editFormData.geoDetails,
                    country: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <Typography variant="h6" sx={{ color: "white" }}>
            Social Media
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="LinkedIn URL"
              value={editFormData.socialDetails.linkedinUrl || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  socialDetails: {
                    ...editFormData.socialDetails,
                    linkedinUrl: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Facebook URL"
              value={editFormData.socialDetails.facebookUrl || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  socialDetails: {
                    ...editFormData.socialDetails,
                    facebookUrl: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Twitter URL"
              value={editFormData.socialDetails.twitterUrl || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  socialDetails: {
                    ...editFormData.socialDetails,
                    twitterUrl: e.target.value,
                  },
                })
              }
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions style={{ backgroundColor: "#333", color: "white" }}>
        <Button
          onClick={() => setEditDialogOpen(false)}
          style={{ color: "white" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateRow}
          style={{ color: "white" }}
          variant="contained"
          color="primary"
        >
          Save Changes
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
        height: "100vh",
        overflowX: "auto",
        backgroundColor: "#333",
        color: "white",
      }}
    >
      <CustomToolbar />
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
      <EditDialog />
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

export default ResultTable;