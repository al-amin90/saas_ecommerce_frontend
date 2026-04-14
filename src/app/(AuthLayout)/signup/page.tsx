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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";

const PRIMARY = "#1A3C34";
const ACCENT = "#E07B1A";

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const strength = !form.password
    ? 0
    : form.password.length < 6
      ? 1
      : form.password.length < 10
        ? 2
        : 3;

  const strengthColors = ["#E0E0E0", "#E53935", "#FFB74D", "#4CAF50"];
  const strengthLabels = ["", "Weak", "Medium", "Strong"];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "#F7F6F2" }}>
      {/* ── Left branding panel ────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "42%",
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
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(224,123,26,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
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
            fontSize: "2rem",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          Join the Community
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: 300,
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Get access to exclusive deals, track your orders, and shop smarter.
        </Typography>

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {[
            { val: "50K+", label: "Happy Customers" },
            { val: "2K+", label: "Products" },
            { val: "4.9★", label: "Rating" },
          ].map((s) => (
            <Box key={s.label} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: ACCENT,
                }}
              >
                {s.val}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.45)",
                  mt: 0.2,
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right form panel ───────────────────────────────────────── */}
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
        <Box sx={{ width: "100%", maxWidth: 440 }}>
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
              mb: 0.5,
              letterSpacing: "-0.02em",
            }}
          >
            Create Account
          </Typography>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#888",
              mb: 4,
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{ color: ACCENT, fontWeight: 600 }}
            >
              Sign in
            </Link>
          </Typography>

          {/* Google */}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#DDDDDD",
              color: "#333",
              py: 1.3,
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
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#BBB",
                fontFamily: "'DM Sans', sans-serif",
                px: 1,
              }}
            >
              or fill in the form
            </Typography>
          </Divider>

          {/* Fields helper */}
          {[
            {
              field: "name",
              label: "FULL NAME",
              type: "text",
              placeholder: "John Doe",
              icon: (
                <PersonOutlineIcon sx={{ fontSize: 18, color: "#AAAAAA" }} />
              ),
            },
            {
              field: "phone",
              label: "PHONE NUMBER",
              type: "tel",
              placeholder: "+880 17XX-XXXXXX",
              icon: (
                <PhoneAndroidOutlinedIcon
                  sx={{ fontSize: 18, color: "#AAAAAA" }}
                />
              ),
            },
            {
              field: "email",
              label: "EMAIL ADDRESS",
              type: "email",
              placeholder: "you@example.com",
              icon: (
                <EmailOutlinedIcon sx={{ fontSize: 18, color: "#AAAAAA" }} />
              ),
            },
          ].map(({ field, label, type, placeholder, icon }) => (
            <Box key={field} sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: PRIMARY,
                  mb: 0.7,
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={type}
                placeholder={placeholder}
                value={form[field as keyof typeof form]}
                onChange={update(field)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{icon}</InputAdornment>
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
              />
            </Box>
          ))}

          {/* Password with strength */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                color: PRIMARY,
                mb: 0.7,
                letterSpacing: "0.04em",
              }}
            >
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={update("password")}
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
                          sx={{ fontSize: 18, color: "#AAA" }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ fontSize: 18, color: "#AAA" }}
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
            />
            {/* Strength bar */}
            {form.password && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background:
                          i <= strength ? strengthColors[strength] : "#E0E0E0",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: strengthColors[strength],
                    mt: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {strengthLabels[strength]}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Confirm password */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                color: PRIMARY,
                mb: 0.7,
                letterSpacing: "0.04em",
              }}
            >
              CONFIRM PASSWORD
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={update("confirm")}
              error={!!form.confirm && form.confirm !== form.password}
              helperText={
                form.confirm && form.confirm !== form.password
                  ? "Passwords do not match"
                  : ""
              }
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
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? (
                        <VisibilityOffOutlinedIcon
                          sx={{ fontSize: 18, color: "#AAA" }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ fontSize: 18, color: "#AAA" }}
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
            />
          </Box>

          {/* Terms checkbox */}
          <FormControlLabel
            sx={{ mb: 3, alignItems: "flex-start" }}
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                size="small"
                sx={{ pt: 0, "&.Mui-checked": { color: PRIMARY } }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#666",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5,
                }}
              >
                I agree to the{" "}
                <Link
                  href="#"
                  underline="hover"
                  sx={{ color: ACCENT, fontWeight: 600 }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  underline="hover"
                  sx={{ color: ACCENT, fontWeight: 600 }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
          />

          {/* Submit */}
          <Button
            fullWidth
            variant="contained"
            disabled={!agreed}
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
              "&.Mui-disabled": { background: "#CCCCCC", color: "#FFFFFF" },
              transition: "all 0.25s",
            }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
