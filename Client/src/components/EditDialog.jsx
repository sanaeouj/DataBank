import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";

const EditDialog = ({ open, onClose, editFormData, setEditFormData, handleUpdateRow }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          onClick={onClose}
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
};

export default EditDialog;