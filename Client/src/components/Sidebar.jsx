import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import {
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ListAlt as ListAltIcon,
  DataUsage as DataUsageIcon,
  Email as EmailIcon,
  Call as CallIcon,
  MeetingRoom as MeetingRoomIcon,
  Chat as ChatIcon,
  AttachMoney as AttachMoneyIcon,
  Task as TaskIcon,
} from "@mui/icons-material";
import Icon from "../assets/icon.png";
const Sidebar = () => {
  const onboardingProgress = 0;

  const sections = [
    {
      title: "PROSPECT & ENRICH",
      items: [
        { text: "Home", icon: <HomeIcon />, to: "/" },
        { text: "People", icon: <PeopleIcon />, to: "/people" },
        { text: "Companies", icon: <BusinessIcon />, to: "/companies" },
        { text: "Lists", icon: <ListAltIcon />, to: "/lists" },
        { text: "Data enrichment", icon: <DataUsageIcon />, to: "/enrichment" },
      ],
    },
    {
      title: "ENGAGE",
      items: [
        { text: "Sequences", icon: <ListAltIcon />, to: "/sequences" },
        { text: "Emails", icon: <EmailIcon />, to: "/emails" },
        { text: "Calls", icon: <CallIcon />, to: "/calls" },
      ],
    },
    {
      title: "WIN DEALS",
      items: [
        { text: "Meetings", icon: <MeetingRoomIcon />, to: "/meetings" },
        { text: "Conversations", icon: <ChatIcon />, to: "/conversations" },
        { text: "Deals", icon: <AttachMoneyIcon />, to: "/deals" },
      ],
    },
    {
      title: "TOOLS & AUTOMATIONS",
      items: [{ text: "Tasks", icon: <TaskIcon />, to: "/tasks" }],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e1e1e",
          color: "#fff",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {" "}
          <img src={Icon} alt="Logo IntelligentB2B" style={{ width: 40 }} />
        </Typography>

         <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2c2c2c",
            padding: "6px 12px",
            borderRadius: 2,
            mb: 2,
            color: "#aaa",
            fontSize: "0.9rem",
          }}
        >
          🔍 Quick search
          <Box sx={{ ml: "auto", fontSize: "0.75rem", opacity: 0.6 }}>
            Ctrl+K
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#333" }} />

      <List dense>
        {sections.map((section) => (
          <Box key={section.title}>
            <Typography sx={{ px: 2, pt: 2, fontSize: 12, color: "#888" }}>
              {section.title}
            </Typography>
            {section.items.map(({ text, icon, to }) => (
              <ListItemButton
                component={NavLink}
                to={to}
                key={text}
                sx={{
                  color: "#fff",
                  "&.active": {
                    backgroundColor: "#333",
                    borderLeft: "4px solid #f4e33d",
                    pl: "12px",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </Box>
        ))}
      </List>

      <Box sx={{ px: 2, mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#f4e33d",
            color: "#000",
            fontWeight: "bold",
            mb: 2,
            "&:hover": {
              bgcolor: "#f2d700",
            },
          }}
        >
          Upgrade
        </Button>

        <Box
          sx={{
            bgcolor: "#2c2c2c",
            borderRadius: 1,
            px: 2,
            py: 1.5,
            mb: 2,
            fontSize: "0.85rem",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Onboarding hub</Typography>
            <Typography sx={{ cursor: "pointer" }}>✖</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={onboardingProgress}
              sx={{
                height: 6,
                borderRadius: 5,
                backgroundColor: "#444",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#f4e33d",
                },
              }}
            />
            <Typography sx={{ fontSize: "0.75rem", mt: 0.5, color: "#aaa" }}>
              {onboardingProgress}% Completed
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#333", my: 1.5 }} />

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Admin Settings
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Name
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
