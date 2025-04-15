import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import laptop from "../assets/laptop.jpg";  

const LandingPage = () => {
  const navigate = useNavigate();

   const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return (
    <>
       <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          backgroundImage: `url(${laptop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
        }}
      >
         <Navbar
          showNavLinks={true}
          showSignUp={true}
          onSignUpClick={handleSignUpClick}
        />

         <Hero onSignUpClick={handleSignUpClick} />
      </Box>

       <Footer />
    </>
  );
};

export default LandingPage;
