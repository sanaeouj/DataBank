import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = "https://databank-yndl.onrender.com";

const CompanyDetails = ({ company, onBack }) => {
  const [openEmployeesDialog, setOpenEmployeesDialog] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Function to flatten nested company data for easier access
  const flattenCompanyData = (companyObj) => {
    const result = {};
    const flatten = (obj, prefix = "") => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          flatten(obj[key], prefix ? `${prefix}.${key}` : key);
        } else {
          result[prefix ? `${prefix}.${key}` : key] = obj[key];
        }
      }
    };
    flatten(companyObj);
    return result;
  };

  // Fetch employees for the selected company
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/company/employees/${encodeURIComponent(company.company)}`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Failed to fetch employees: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEmployeesClick = () => {
    fetchEmployees();
    setOpenEmployeesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEmployeesDialog(false);
    setEmployees([]);
  };

  const flattenedData = flattenCompanyData(company);

  // Format values for display
  const formatValue = (key, value) => {
    if (!value) return "N/A";
    return value.toString();
  };

  // Group keys by prefixes for better display
  const groupKeysByPrefix = (data) => {
    const grouped = {};
    Object.keys(data).forEach((key) => {
      const prefix = key.includes(".") ? key.split(".")[0] : "General";
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(key);
    });
    return grouped;
  };

  const groupedData = groupKeysByPrefix(flattenedData);

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to companies
      </Button>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        {company.company || "N/A"}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
        {company.industry || "N/A"}  - {company.employees || "N/A"} employees 
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip label="Overview" variant="outlined" />
        <Chip label="Employees" variant="outlined" onClick={handleEmployeesClick} />
      </Box>
      {Object.entries(groupedData).map(([section, keys]) => (
        <React.Fragment key={section}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                      {key.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {formatValue(key, flattenedData[key])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      ))}

      {/* Dialog for Employees */}
      <Dialog open={openEmployeesDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Employees Information</DialogTitle>
        <DialogContent>
          {employees && employees.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Seniority</TableCell>
                    <TableCell>Departments</TableCell>
                    <TableCell>Mobile Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Email Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.personalid}>
                      <TableCell>{employee["First Name"]}</TableCell>
                      <TableCell>{employee["Last Name"]}</TableCell>
                      <TableCell>{employee.title || "N/A"}</TableCell>
                      <TableCell>{employee.seniority || "N/A"}</TableCell>
                      <TableCell>{employee.departments || "N/A"}</TableCell>
                      <TableCell>{employee.mobilePhone}</TableCell>
                      <TableCell>{employee.email || "N/A"}</TableCell>
                      <TableCell>{employee.emailStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No employee data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyDetails;