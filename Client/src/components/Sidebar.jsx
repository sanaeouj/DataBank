import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
   InputBase,
  CssBaseline,
  Fab,
  Tooltip,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ListAlt as ListAltIcon,
  PersonAdd as PersonAddIcon,
  BrowserUpdated as BrowserUpdatedIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Icon from "../assets/Icon.png";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    background: { default: "#333", paper: "#1e1e1e" },
    text: { primary: "#f3f4f6", secondary: "#d1d5db" },
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
  },
});

const drawerWidth = 240;
const miniDrawerWidth = 70;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      title: "PROSPECT & ENRICH",
      items: [
        { text: "Home", icon: <HomeIcon />, to: "/Home" },
        { text: "People", icon: <PeopleIcon />, to: "/People" },
        { text: "Add People", icon: <PersonAddIcon />, to: "/addpeople" },
         { text: "Companies", icon: <BusinessIcon />, to: "/companies" },
        { text: "Lists", icon: <ListAltIcon />, to: "/lists" },
      ],
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        sx={{
          width: isOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: isOpen ? drawerWidth : miniDrawerWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            backgroundColor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: isOpen ? "flex-start" : "center",
          }}
        >
          <img src={Icon} alt="Logo IntelligentB2B" style={{ width: 40 }} />
        </Box>

        {isOpen && (
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              bgcolor: alpha("#fff", 0.05),
              "&:hover": { bgcolor: alpha("#fff", 0.1) },
              mx: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                height: "100%",
                display: "flex",
                alignItems: "center",
                pl: 2,
              }}
            >
              <SearchIcon size={20} color="#9ca3af" />
            </Box>
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                color: "text.primary",
                pl: 5,
                py: 1.5,
                width: "100%",
              }}
            />
          </Box>
        )}

        <Divider sx={{ borderColor: "#444" }} />

        <List dense>
          {sections.map((section) => (
            <Box key={section.title}>
              {isOpen && (
                <Typography
                  sx={{ px: 2, pt: 2, fontSize: 12, color: "text.secondary" }}
                >
                  {section.title}
                </Typography>
              )}
              {section.items.map(({ text, icon, to }) => (
                <ListItemButton
                  component={NavLink}
                  to={to}
                  key={text}
                  sx={{
                    color: "text.primary",
                    justifyContent: isOpen ? "initial" : "center",
                    px: isOpen ? 2 : 1,
                    "&.active": {
                      backgroundColor: "primary.main",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "text.primary",
                      minWidth: 0,
                      mr: isOpen ? 2 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={text} />}
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>

        {/* Supprimer ce bloc pour retirer le bouton bleu */}
        {/* 
        <Tooltip title="Add New Item" placement="left">
          <Fab
            color="primary"
            sx={{
              position: "absolute",
              bottom: 24,
              right: isOpen ? 24 : 8,
              transition: "all 0.3s",
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        */}
      </Drawer>
    </ThemeProvider>
  );
};

export default Sidebar;