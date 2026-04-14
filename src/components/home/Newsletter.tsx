"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1A1A1A 0%, #2C2016 100%)",
        py: { xs: 7, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(200,169,126,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(200,169,126,0.05) 0%, transparent 40%)`,
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C8A97E",
            mb: 2,
          }}
        >
          Newsletter
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: "#FFFFFF",
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 800,
            letterSpacing: "-0.03em",
            mb: 2,
          }}
        >
          Get Exclusive Deals
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            mb: 4,
            maxWidth: 440,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Subscribe to our newsletter and get{" "}
          <strong style={{ color: "#C8A97E" }}>15% off</strong> your first
          order, plus exclusive deals and new arrivals.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0,
            maxWidth: 480,
            mx: "auto",
            borderRadius: "2px",
            overflow: "hidden",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          <TextField
            fullWidth
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            inputprops={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon
                    sx={{ color: "rgba(255,255,255,0.4)", fontSize: "1.1rem" }}
                  />
                </InputAdornment>
              ),
              sx: {
                background: "rgba(255,255,255,0.08)",
                borderRadius: 0,
                color: "#FFFFFF",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&::placeholder": { color: "rgba(255,255,255,0.4)" },
              },
            }}
            inputprops={{
              style: { color: "#FFFFFF" },
            }}
          />
          <Button
            onClick={handleSubmit}
            sx={{
              background: "#C8A97E",
              color: "#1A1A1A",
              borderRadius: 0,
              px: 4,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": { background: "#D4BA95" },
            }}
          >
            Subscribe
          </Button>
        </Box>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.72rem",
            fontFamily: "'DM Sans', sans-serif",
            mt: 2,
          }}
        >
          No spam ever. Unsubscribe anytime.
        </Typography>
      </Container>

      <Snackbar
        open={submitted}
        autoHideDuration={4000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSubmitted(false)}
          sx={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          🎉 Subscribed! Check your inbox for your 15% discount code.
        </Alert>
      </Snackbar>
    </Box>
  );
}
