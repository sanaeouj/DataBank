import React from "react";
import { Box, Typography, Grid, Link, Button } from "@mui/material";
import Icon from "../assets/Icon.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        color: "#1D1D1D",
        padding: "60px 40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: "40px" }}>
        <img src={Icon} alt="Logo IntelligentB2B" style={{ width: 80 }} />
      </Box>

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", marginBottom: "15px" }}
          >
            Get Started
          </Typography>
       
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Pricing
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Request a Demo
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", marginBottom: "15px" }}
          >
            Product
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Pipeline Builder
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Call Assistant
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Data Enrichment
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Go-To-Market Platform
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", marginBottom: "15px" }}
          >
            Resources
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              IntelligentB2B Academy
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Magazine
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Insights
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Partners
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", marginBottom: "15px" }}
          >
            Company
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Careers
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Customer Reviews
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="hover" color="inherit">
              Contact Us & Sales
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", marginBottom: "15px" }}
          >
            Prospect Anywhere
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            Get verified emails and phone numbers and instantly reach out while
            working in your favorite tools.
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          textAlign: "center",
          borderTop: "1px solid #ddd",
          paddingTop: "30px",
          marginTop: "40px",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: "10px" }}>
          © 2025 IntelligentB2B. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Link href="#" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Terms
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Don't Sell My Info
          </Link>
          <Link href="#" underline="hover" color="inherit">
            About IntelligentB2B
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
