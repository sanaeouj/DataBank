import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  Autocomplete,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import GoogleIcon from "../assets/google-logo.png";

import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebaseAuth";

import Navbar from "../components/Navbar";

const emailOptions = ["test@example.com"];

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Failed to sign in with Google.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Failed to create an account.");
    }
  };

  return (
    <>
      <Navbar showNavLinks={false} showSignIn={false} />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          color: "#1e1e1e",
          backgroundColor: "#D1CECB",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
            py: 4,
            px: { xs: 2, sm: 6 },
            backgroundColor: "#fff",
            boxShadow: { md: 3 },
            borderRadius: { md: "32px 0 0 32px" },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 2, color: "#1e1e1e" }}
          >
            Sign up for IntelligentB2B — free forever
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "#1e1e1e" }}>
            AI-powered sales engine to reach and convert your ideal buyers from
            a database of over 210 million contacts.
          </Typography>

          <Box component="form" onSubmit={handleAuth} sx={{ maxWidth: 400 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#1e1e1e" }}>
                  By signing up, I agree to the{" "}
                  <a href="#" style={{ color: "#1e1e1e" }}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" style={{ color: "#1e1e1e" }}>
                    Privacy Policy
                  </a>
                  .
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Stack spacing={2}>
              <Autocomplete
                freeSolo
                options={emailOptions}
                onInputChange={(event, newValue) => setEmail(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email"
                    variant="outlined"
                    value={email}
                    autoComplete="off"
                    InputLabelProps={{ style: { color: "#1e1e1e" } }}
                    InputProps={{
                      ...params.InputProps,
                      style: { color: "#1e1e1e", backgroundColor: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "grey" },
                        "&:hover fieldset": { borderColor: "grey" },
                        "&.Mui-focused fieldset": { borderColor: "grey" },
                      },
                    }}
                  />
                )}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                InputLabelProps={{ style: { color: "#1e1e1e" } }}
                InputProps={{
                  style: { color: "#1e1e1e", backgroundColor: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "grey" },
                    "&:hover fieldset": { borderColor: "grey" },
                    "&.Mui-focused fieldset": { borderColor: "grey" },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="off"
                InputLabelProps={{ style: { color: "#1e1e1e" } }}
                InputProps={{
                  style: { color: "#1e1e1e", backgroundColor: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "grey" },
                    "&:hover fieldset": { borderColor: "grey" },
                    "&.Mui-focused fieldset": { borderColor: "grey" },
                  },
                }}
              />

              <Divider sx={{ color: "#1e1e1e" }}>or</Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleSignIn}
                startIcon={
                  <img src={GoogleIcon} alt="Google" style={{ width: 20 }} />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#1e1e1e",
                  borderColor: "#1e1e1e",
                }}
              >
                Sign up with Google
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "0 32px 32px 0",
          }}
        />
      </Box>
    </>
  );
};

export default SignUp;
