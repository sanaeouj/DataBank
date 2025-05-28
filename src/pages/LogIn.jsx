import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import GoogleIcon from "../assets/google-logo.png";
import {
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/firebaseAuth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AlertSnackbar = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleGoogleLogIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      const userDoc = await getDoc(doc(db, "authorizedUsers", userEmail));
      console.log("userEmail:", userEmail, "userDoc.exists:", userDoc.exists());

      if (!userDoc.exists()) {
        await signOut(auth);
        showSnackbar("Accès refusé : vous n'êtes pas autorisé à vous connecter.", "error");
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", result.user.displayName || "User");
      navigate("/Home");
    } catch (error) {
      console.error("Google Log-In Error:", error);
      showSnackbar("Failed to log in with Google.", "error");
    }
  };

  const handleEmailPasswordLogIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", userCredential.user.displayName || "User");

      navigate("/Home");
    } catch (error) {
      console.error("Email Log-In Error:", error);
      showSnackbar(
        "Failed to log in. Please check your email and password.",
        "error"
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showSnackbar("Please enter your email to reset your password.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showSnackbar("A password reset email has been sent.", "success");
    } catch (error) {
      console.error("Password Reset Error:", error);
      showSnackbar("Failed to send reset email. Please try again.", "error");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 5,
          }}
        >
          <Typography variant="h6" color="white" sx={{ mb: 2 }}>
            Log In
          </Typography>

          <Stack spacing={2} sx={{ maxWidth: 400 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogIn}
              startIcon={
                <img src={GoogleIcon} alt="Google" style={{ width: 20 }} />
              }
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                color: "white",
                borderColor: "gray",
                "&:hover": {
                  borderColor: "#facc15",
                  color: "#facc15",
                },
              }}
            >
              Log In with Google
            </Button>

            <Divider sx={{ color: "gray" }}>OR</Divider>

            <form onSubmit={handleEmailPasswordLogIn}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: "gray" } }}
                  InputProps={{
                    style: {
                      color: "white",
                      backgroundColor: "#1e1e1e",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "gray",
                      },
                      "&:hover fieldset": {
                        borderColor: "#facc15",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#facc15",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: "gray" } }}
                  InputProps={{
                    style: {
                      color: "white",
                      backgroundColor: "#1e1e1e",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "gray",
                      },
                      "&:hover fieldset": {
                        borderColor: "#facc15",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#facc15",
                      },
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    color: "#facc15",
                    textAlign: "right",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{
                        color: "gray",
                        "&.Mui-checked": {
                          color: "#facc15",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "gray", fontSize: "0.9rem" }}>
                      Keep me signed in
                    </Typography>
                  }
                />

                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    bgcolor: "#facc15",
                    color: "#1e1e1e",
                    fontWeight: "bold",
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#eab308",
                    },
                  }}
                >
                  Log In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1287&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <AlertSnackbar
            onClose={() => setSnackOpen(false)}
            severity={snackSeverity}
          >
            {snackMessage}
          </AlertSnackbar>
        </Snackbar>
      </Box>
    </>
  );
};

export default LogIn;