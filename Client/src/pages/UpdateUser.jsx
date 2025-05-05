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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const UpdateUser = () => {
  const [data, setData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ressources/all");
      const result = await response.json();
 
      if (Array.isArray(result) && result.length) {
        const flattenedData = result.map(flattenObject).map(item => {
           if (item["Latest Funding"]) {
            item["Latest Funding"] = new Date(item["Latest Funding"]).toLocaleDateString("fr-FR");
          }
           return item;
        });
         setData(flattenedData);
      } else {
       }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleEditClick = (row) => {
    setSelectedRow(row); 
    setUpdatedRow(row);  
    setEditDialogOpen(true);  
  };
 
 

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/ressources/update", {
        id: selectedRow["personalid"],
        personalDetails: {
          firstName: updatedRow["First Name"],
          lastName: updatedRow["Last Name"],
          title: updatedRow["title"],
          seniority: updatedRow["seniority"],
          departments: updatedRow["departments"],
          mobilePhone: updatedRow["Mobile Phone"],
          email: updatedRow["email"],
          EmailStatus: updatedRow["EmailStatus"],
        },
        companyDetails: {
          company: updatedRow["company.company"],
          email: updatedRow["company.Email"],
          phone: updatedRow["company.Phone"],
          employees: updatedRow["company.employees"],
          industry: updatedRow["company.industry"],
          seoDescription: updatedRow["company.SEO Description"],
          annualRevenue: updatedRow["company.Annual Revenue"],
          totalFunding: updatedRow["company.Total Funding"],
        },
        geoDetails: {
          address: updatedRow["geo.address"],
          city: updatedRow["geo.city"],
          state: updatedRow["geo.state"],
          country: updatedRow["geo.country"],
        },
        revenueDetails: {
          companyName: updatedRow["revenue.Company Name"],
          annualRevenue: updatedRow["revenue.Annual Revenue"],
          totalFunding: updatedRow["revenue.Total Funding"],
          latestFunding: updatedRow["revenue.Latest Funding"],
          latestFundingAmount: updatedRow["revenue.Latest Funding Amount"],
        },
        socialDetails: {
          linkedinUrl: updatedRow["social.Company Linkedin Url"],
          facebookUrl: updatedRow["social.Facebook Url"],
          twitterUrl: updatedRow["social.Twitter Url"],
        },
      });
       fetchData();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const filteredData = data.filter(user =>
    (user["First Name"] && user["First Name"].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user["Last Name"] && user["Last Name"].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const excludedColumns = ["personalid", "companyid", "geoid", "revenueid", "socialid"];
  const displayedColumns = Object.keys(data[0] || {})
  .filter((key) => !excludedColumns.includes(key))
  .map((key) => {
    if (key === "social.Company Linkedin Url") {
      return {
        field: key,
        headerName: "Social Company LinkedIn",
        width: 200,
        renderCell: (params) => 
          params.value ? (
            <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
              Link
            </a>
          ) : (
            "N/A"  
          ),
      };
    } else if (key === "social.Facebook Url") {
      return {
        field: key,
        headerName: "Social Facebook Url",
        width: 200,
        renderCell: (params) => 
          params.value ? (
            <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
              Link
            </a>
          ) : (
            "N/A"
          ),
      };
    } else if (key === "social.Twitter Url") {
      return {
        field: key,
        headerName: "Social Twitter Url",
        width: 200,
        renderCell: (params) => 
          params.value ? (
            <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
              Link
            </a>
          ) : (
            "N/A"
          ),
      };
    }

    return {
      field: key,
      headerName: key.replace(/\./g, " ").replace(/([A-Z])/g, " $1").trim(),
      width: 200,
      renderCell: (params) => {
        if (key === "Latest Funding") {
          return new Date(params.row[key]).toLocaleDateString("fr-FR");
        }
        return params.value;
      }
    };
  });
  
  displayedColumns.push({
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Button
        startIcon={<EditIcon />}
        onClick={() => handleEditClick(params.row)}
        style={{ color: "white" }}
      >
        Update
      </Button>
    ),
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px", backgroundColor: "#1e1e1e", color: "white" }}>
        <Typography variant="h5" sx={{ mb: 2, color: "white" }}>
          User Data
        </Typography>
        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search by First or Last Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            sx={{ backgroundColor: "#1e1e1e", width: '100%', maxWidth: 400 }}
          />
        </Box>
        <DataGrid
          rows={filteredData}
          columns={displayedColumns}
          getRowId={(row) => row["personalid"] || Math.random()}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            fontSize: "20px",
            height: "100%",
            overflowX: "auto",
            backgroundColor: "#1e1e1e",
            color: "white",
             "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1e1e1e",
              color: "white",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row": { backgroundColor: "#1e1e1e", color: "white" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#1e1e1e",
              color: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#1e1e1e",
              color: "white",
            },
            "& .MuiDataGrid-filler": { backgroundColor: "#1e1e1e", color: "white" },
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
          sx={{ backgroundColor: "#1e1e1e" }}
        >
          <DialogTitle style={{ backgroundColor: "#1e1e1e", color: "white" }}>
            Edit Row
          </DialogTitle>
          <DialogContent style={{ backgroundColor: "#1e1e1e", color: "white" }}>
            {selectedRow &&
              Object.keys(selectedRow).map((key) => (
                <TextField
                  key={key}
                  label={key}
                  value={updatedRow[key] || ""}
                  onChange={(e) =>
                    setUpdatedRow((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  fullWidth
                  margin="dense"
                  InputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  style={{ backgroundColor: "#1e1e1e" }}
                />
              ))}
          </DialogContent>
          <DialogActions style={{ backgroundColor: "#1e1e1e", color: "white" }}>
            <Button onClick={() => setEditDialogOpen(false)} style={{ color: "white" }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} style={{ color: "white" }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UpdateUser;