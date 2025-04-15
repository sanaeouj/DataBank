import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
const services = [
  "Find & engage leads",
  "Grow your business",
  "Automate outreach",
  "Optimize calls",
  "Manage deals",
];

const Hero = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const navigate = useNavigate();
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % services.length;
      const fullText = services[i];

      setText((prevText) =>
        isDeleting
          ? fullText.substring(0, prevText.length - 1)
          : fullText.substring(0, prevText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        py: 10,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 2 }}>
        <Typography variant="caption" sx={{ letterSpacing: 2 }}>
          Intelligentb2b AI SALES PLATFORM
        </Typography>

        <Typography variant="h3" sx={{ my: 2, fontWeight: "bold" }}>
          The only tool you need
          <br />
          to{" "}
          <Box
            component="span"
            sx={{
              color: "#facc15",
              fontSize: "2.5rem",
              fontWeight: "bold",
              borderRight: "2px solid #facc15",
              whiteSpace: "nowrap",
              pr: 1,
              animation: "blink-caret 0.75s step-end infinite",
            }}
          >
            {text}
          </Box>
        </Typography>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/SignUp")} //
            sx={{
              backgroundColor: "#facc15",
              color: "#000",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "#fbbf24" },
            }}
          >
            Get started for free
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#fff",
              color: "#fff",
              textTransform: "none",
              px: 3,
              "&:hover": { borderColor: "#facc15", color: "#facc15" },
            }}
          >
            Request a demo
          </Button>
        </Box>
      </Container>

      <style>
        {`
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #facc15; }
          }
        `}
      </style>
    </Box>
  );
};

export default Hero;
