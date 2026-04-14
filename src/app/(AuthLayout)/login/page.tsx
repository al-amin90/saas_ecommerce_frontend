"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const PRIMARY = "#1A3C34";
const ACCENT = "#E07B1A";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "#F7F6F2",
      }}
    >
      {/* ── Left panel (image + brand) ─────────────────────────────── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "45%",
          flexShrink: 0,
          background: PRIMARY,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(224,123,26,0.15)",
          }}
        />

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              background: ACCENT,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9.5L12 3l9 6.5V21H3V9.5z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 21v-7h6v7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="1.5" fill="#fff" />
            </svg>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "1.4rem",
                color: "#fff",
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              GHORER
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "1.4rem",
                color: ACCENT,
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              BAZAR
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "2.2rem",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: 320,
            lineHeight: 1.7,
          }}
        >
          Sign in to access your orders, wishlist, and exclusive member deals.
        </Typography>

        {/* Feature pills */}
        {[
          "Free delivery on ৳3,000+",
          "100% authentic products",
          "Easy 30-day returns",
        ].map((f) => (
          <Box
            key={f}
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              background: "rgba(255,255,255,0.07)",
              borderRadius: "8px",
              px: 2.5,
              py: 1.2,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ACCENT,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {f}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Right panel (form) ─────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: ACCENT,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9.5L12 3l9 6.5V21H3V9.5z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21v-7h6v7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "1.2rem",
                color: ACCENT,
              }}
            >
              GHORER BAZAR
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.9rem",
              color: PRIMARY,
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            Sign In
          </Typography>
          {/* <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#888",
              mb: 4,
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              underline="hover"
              sx={{ color: ACCENT, fontWeight: 600 }}
            >
              Create one free
            </Link>
          </Typography> */}

          {/* Google button */}
          {/* <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#DDDDDD",
              color: "#333",
              py: 1.4,
              mb: 3,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.88rem",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { borderColor: "#BBBBBB", background: "#FAFAFA" },
              display: "flex",
              gap: 1.5,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4c-7.8 0-14.5 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8L6 32.9C9.2 39.4 16 44 24 44z"
              />
              <path
                fill="#1565C0"
                d="M43.6 20H24v8h11.3c-.9 2.6-2.6 4.8-4.8 6.3l6.2 5.2C41 36.4 44 30.7 44 24c0-1.3-.1-2.7-.4-4z"
              />
            </svg>
            Continue with Google
          </Button> */}

          {/* <Divider sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#BBB",
                fontFamily: "'DM Sans', sans-serif",
                px: 1,
              }}
            >
              or sign in with email
            </Typography>
          </Divider> */}

          {/* Email */}
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: PRIMARY,
              mb: 0.8,
              letterSpacing: "0.04em",
            }}
          >
            Email
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: "#AAAAAA" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0E0E0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: PRIMARY,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: PRIMARY,
                  borderWidth: 1.5,
                },
              },
            }}
            sx={{ mb: 1.5 }}
          />

          {/* Password */}
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: PRIMARY,
              mb: 0.8,
              letterSpacing: "0.04em",
            }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 18, color: "#AAAAAA" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPass(!showPass)}
                    edge="end"
                  >
                    {showPass ? (
                      <VisibilityOffOutlinedIcon
                        sx={{ fontSize: 18, color: "#AAAAAA" }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ fontSize: 18, color: "#AAAAAA" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0E0E0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: PRIMARY,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: PRIMARY,
                  borderWidth: 1.5,
                },
              },
            }}
            sx={{ mb: 1.5 }}
          />

          {/* Forgot */}
          <Box sx={{ textAlign: "right", mb: 3 }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{
                fontSize: "0.8rem",
                color: ACCENT,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Submit */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              background: PRIMARY,
              color: "#fff",
              py: 1.5,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                background: "#0F2820",
                boxShadow: "0 4px 20px rgba(26,60,52,0.3)",
              },
              transition: "all 0.25s",
            }}
          >
            Sign In
          </Button>

          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              fontSize: "0.78rem",
              color: "#AAA",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            By continuing you agree to our{" "}
            <Link href="#" underline="hover" sx={{ color: "#888" }}>
              Terms
            </Link>
            {" & "}
            <Link href="#" underline="hover" sx={{ color: "#888" }}>
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
