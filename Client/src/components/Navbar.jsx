import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Icon from "../assets/Icon.png";

const Navbar = ({ showNavLinks = true, showSignUp = true }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "#D1CECB",
        borderBottom: "1px solid #000",
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img src={Icon} alt="Logo IntelligentB2B" style={{ width: 40 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "18px",
                color: "#000",
              }}
            >
              IntelligentB2B
            </Typography>
          </Box>

          {showNavLinks && (
            <Box display="flex" gap={4}>
              {["Platform", "Roles", "Resources", "Pricing"].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "#000",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              sx={{
                color: "#000",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
              }}
            >
              Get a demo
            </Button>

            {showSignUp && (
              <Button
                onClick={() => navigate("/login")}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  color: "#000",
                  borderColor: "#000",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#000",
                    color: "#fff",
                    borderColor: "#000",
                  },
                }}
              >
                Log in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
