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
import ExcelJS from "exceljs";

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
  const headerMapping = {
    "First Name": "First Name",
    "Last Name": "Last Name",
    "title": "Title",                
    "seniority": "Seniority",        
    "departments": "Departments",     
    "mobilePhone": "Mobile Phone",
    "email": "Email",                
    "EmailStatus": "Email Status",
    "company_company": "Company",
    "company_Email": "Company Email",
    "company_Phone": "Company Phone",
    "company_employees": "Employees",
    "company_industry": "Industry",
    "company_SEO Description": "SEO Description",
    "company_linkedinlink": "Company LinkedIn",
    "company_website": "Company Website",
    "geo_address": "Address",
    "geo_city": "City",
    "geo_state": "State",
    "geo_country": "Country",
    "social_Company Linkedin Url": "LinkedIn",
    "social_Facebook Url": "Facebook",
    "social_Twitter Url": "Twitter",
    "revenue_Annual Revenue": "Annual Revenue",
    "revenue_Total Funding": "Total Funding",
    "revenue_Latest Funding Amount": "Latest Funding Amount",
    "revenue_Latest Funding": "Latest Funding Date",
  };
const hiddenColumns = [
  "personalid",
  "companyid",
  "company_companyid",    
  "companycompanyid",   
  "company_personalid",
  "geoid",
  "geocompanyid",
  "revenueid",
  "revenue.companyid",
  "revenue_companyid",   
  "revenuecompanyid",     
  "socialid",
  "social_companyid",
  "socialcompanyid"
];

  const flattenData = (data) => {
  return data.map(item => {
    return {
       "personalid": item.personalid,
      "First Name": item["First Name"] || "",
      "Last Name": item["Last Name"] || "",
      "title": item.title || "",
      "seniority": item.seniority || "",
      "departments": item.departments || "",
      "mobilePhone": item.mobilePhone || "",
      "email": item.email || "",
      "EmailStatus": item.EmailStatus || "",

       "company_company": item.company?.company || "",
      "company_Email": item.company?.Email || "",
      "company_Phone": item.company?.Phone || "",
      "company_employees": item.company?.employees || "",
      "company_industry": item.company?.industry || "",
      "company_SEO Description": item.company?.["SEO Description"] || "",
      "company_linkedinlink": item.company?.linkedinlink || "",
      "company_website": item.company?.website || "",

       "geo_address": item.geo?.address || "",
      "geo_city": item.geo?.city || "",
      "geo_state": item.geo?.state || "",
      "geo_country": item.geo?.country || "",

       "revenue_Latest Funding": item.revenue?.["Latest Funding"] || "",
      "revenue_Latest Funding Amount": item.revenue?.["Latest Funding Amount"] || "",

       "social_Company Linkedin Url": item.social?.["Company Linkedin Url"] || "",
      "social_Facebook Url": item.social?.["Facebook Url"] || "",
      "social_Twitter Url": item.social?.["Twitter Url"] || ""
    };
  });
};

  const getColumnsFromData = (data) => {
    if (!data || !data.length) return [];
    const columns = [];

    const sampleItem = flattenData([data[0]])[0];
    for (const key in sampleItem) {
      if (!hiddenColumns.some((hc) => key.includes(hc))) {
        columns.push({
          field: key,
          headerName:
            headerMapping[key] ||
            key
              .split("_")
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" "),
          width: 200,
          renderCell: (params) => {
             if (
              key === "company_linkedinlink" ||
              key === "company_website"
            ) {
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
                  {key === "company_linkedinlink" ? "LinkedIn" : "Website"}
                </a>
              ) : (
                ""
              );
            }
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
                  LINK
                </a>
              ) : (
                ""
              );
            }
            return params.value || "";
          },
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
        firstName: row["First Name"] || "",
        lastName: row["Last Name"] || "",
        Title: row.title || "",
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
        employees: row.companyemployees
          ? row.companyemployees.toString()
          : "",
        industry: row.companyindustry || "",
        seoDescription: row["companySEO Description"] || "",
        linkedinlink: row.companylinkedinlink || "",  
        website: row.companywebsite || "",            
      },
      geoDetails: {
        address: row.geoaddress || "",
        city: row.geocity || "",
        state: row.geostate || "",
        country: row.geocountry || "",
      },
      revenueDetails: {
        latestFunding: row["revenueLatest Funding"]
          ? formatDateForInput(row["revenueLatest Funding"])
          : "",
        latestFundingAmount: row["revenueLatest Funding Amount"]
          ? row["revenueLatest Funding Amount"].toString()
          : "",
      },
      socialDetails: {
        linkedinUrl: row["socialCompany Linkedin Url"] || "",
        facebookUrl: row["socialFacebook Url"] || "",
        twitterUrl: row["socialTwitter Url"] || "",
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
          linkedinlink: editFormData.companyDetails.linkedinlink || "",  
          website: editFormData.companyDetails.website || "",           
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
      await axios.put(
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
            company_company: updateData.companyDetails.company,
            company_Email: updateData.companyDetails.email,
            company_Phone: updateData.companyDetails.phone,
            company_employees: updateData.companyDetails.employees,
            company_industry: updateData.companyDetails.industry,
            "company_SEO Description": updateData.companyDetails.seoDescription,
            company_linkedinlink: updateData.companyDetails.linkedinlink,  
            company_website: updateData.companyDetails.website,            
            geo_address: updateData.geoDetails.address,
            geo_city: updateData.geoDetails.city,
            geo_state: updateData.geoDetails.state,
            geo_country: updateData.geoDetails.country,
            "revenue_Latest Funding": updateData.revenueDetails.latestFunding,
            "revenue_Latest Funding Amount":
              updateData.revenueDetails.latestFundingAmount,
            "social_Company Linkedin Url": updateData.socialDetails.linkedinUrl,
            "social_Facebook Url": updateData.socialDetails.facebookUrl,
            "social_Twitter Url": updateData.socialDetails.twitterUrl,
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
      setSnackbar({
        open: true,
        message: "Failed to delete row.",
        severity: "error",
      });
    }
  };

const importMapping = {
  "First Name": "First Name",
  "Last Name": "Last Name",
  "Title": "title",               
  "Seniority": "seniority",       
  "Departments": "departments",   
  "Mobile Phone": "mobilePhone",
  "Email": "email",                 
  "Email Status": "EmailStatus",
  "Company": "company_company",
  "Company Email": "company_Email",
  "Company Phone": "company_Phone",
  "Employees": "company_employees",
  "Industry": "company_industry",
  "SEO Description": "company_SEO Description",
  "Company LinkedIn": "company_linkedinlink",
  "Company Website": "company_website",
  "Address": "geo_address",
  "City": "geo_city",
  "State": "geo_state",
  "Country": "geo_country",
  "Latest Funding Date": "revenue_Latest Funding",
  "Latest Funding Amount": "revenue_Latest Funding Amount",
  "LinkedIn": "social_Company Linkedin Url",
  "Facebook": "social_Facebook Url",
  "Twitter": "social_Twitter Url"
};

const exportToCSV = () => {
  if (!filteredData.length) {
    alert("No data to export.");
    return;
  }

   const headers = Object.keys(importMapping);
  
   const csvRows = filteredData.map(row => {
    return headers.map(header => {
      const fieldName = importMapping[header];
      const cellValue = row[fieldName];
      
       return `"${(cellValue !== null && cellValue !== undefined ? cellValue.toString().replace(/"/g, '""') : '')}"`;
    }).join(',');
  });

  csvRows.unshift(headers.map(h => `"${h}"`).join(','));
   const csvContent = csvRows.join('\n');

   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'databank_export.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

 const exportToExcel = async () => {
  if (!filteredData.length) {
    alert("No data to export.");
    return;
  }

  try {
    const headers = Object.keys(importMapping);

     const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

     worksheet.addRow(headers);

     filteredData.forEach(row => {
      const rowData = headers.map(header => {
        const fieldName = importMapping[header];
        return row[fieldName] || '';
      });
      worksheet.addRow(rowData);
    });

     const buffer = await workbook.xlsx.writeBuffer();

     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'databank_export.xlsx');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    setSnackbar({
      open: true,
      message: "Failed to export to Excel",
      severity: "error",
    });
  }
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