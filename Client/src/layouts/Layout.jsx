import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#121212",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Dashboard isOpen={isOpen} />
    </Box>
  );
};

export default Layout;
