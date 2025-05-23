import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Toolbar,
} from "@mui/material";
 import DownloadIcon from "@mui/icons-material/Download";

const CustomToolbar = ({ exportToCSV, exportToExcel, setSettingsDialogOpen }) => {
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
        style={{ color: "white", margin: "16px" }}
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
    
    </Toolbar>
  );
};

export default CustomToolbar;