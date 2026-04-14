"use client";
import { useState } from "react";
import {
  Badge,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Person2 } from "@mui/icons-material";

const PRIMARY = "#1A3C34"; // dark teal (like ghorerbazar dark bar)
const ACCENT = "#E07B1A"; // orange accent

const categories = [
  { label: "Home", href: "/" },
  // {
  //   label: "Honey",
  //   href: "#",
  //   children: ["Raw Honey", "Sidr Honey", "Black Seed Honey"],
  // },
  { label: "All Products", href: "/" },
  { label: "Boishakhi Dhamaka Offer!", href: "/" },
  { label: "Samba Craze", href: "/" },
  { label: "Kids", href: "/" },
  { label: "Sandals", href: "/" },
  { label: "Sneakers", href: "/" },
];

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({
  cartCount = 3,
  wishlistCount = 2,
}: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  return (
    <>
      {/* ── Row 1: Logo / Search / Icons ─────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#FFFFFF",
          color: PRIMARY,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 0 }, gap: 2 }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
                mr: 3,
              }}
            >
              {/* House icon (inline SVG) */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  background: ACCENT,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
              <Box
                sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.1 }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.08em",
                    color: ACCENT,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  Ghorer
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.08em",
                    color: ACCENT,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  Bazar
                </Typography>
              </Box>
            </Box>

            {/* Search bar — takes remaining space */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="relative w-[300px] max-w-full">
                <input
                  type="text"
                  placeholder="Search in..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-4 pr-12 py-1.5 text-sm font-['DM_Sans'] border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E07B1A] focus:border-transparent"
                />
                <button
                  onClick={() => {
                    /* handle search */
                  }}
                  className="absolute right-0 top-0 h-full w-9 bg-[#E07B1A] rounded-r-md flex items-center justify-center cursor-pointer hover:bg-[#b8976e] transition-colors"
                >
                  <SearchIcon sx={{ color: "#fff", fontSize: 18 }} />
                </button>
              </div>
            </Box>

            {/* Right icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, md: 1 },
                ml: "auto",
              }}
            >
              {/* Track Order */}
              {/* <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  px: 1,
                  "& svg": { color: PRIMARY },
                  "&:hover svg, &:hover span": { color: ACCENT },
                }}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.65rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: PRIMARY,
                    mt: 0.2,
                  }}
                >
                  Track Order
                </Typography>
              </Box> */}

              {/* Sign In */}
              <Box
                component="a"
                href="/login"
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  px: 1,
                  textDecoration: "none",
                  "& svg": { color: PRIMARY },
                  "&:hover svg, &:hover span": { color: ACCENT },
                }}
              >
                <Person2 sx={{ fontSize: 22 }} />
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.65rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: PRIMARY,
                    mt: 0.2,
                  }}
                >
                  Sign In
                </Typography>
              </Box>

              {/* Wishlist */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  px: 1,
                  "&:hover svg, &:hover span": { color: ACCENT },
                }}
              >
                <Badge
                  badgeContent={wishlistCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      background: ACCENT,
                      color: "#fff",
                      fontSize: "0.6rem",
                    },
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 22, color: PRIMARY }} />
                </Badge>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.65rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: PRIMARY,
                    mt: 0.2,
                  }}
                >
                  Wishlist
                </Typography>
              </Box>

              {/* Cart */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  px: 1,
                  "&:hover svg, &:hover span": { color: ACCENT },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      background: ACCENT,
                      color: "#fff",
                      fontSize: "0.6rem",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon
                    sx={{ fontSize: 22, color: PRIMARY }}
                  />
                </Badge>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.65rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: PRIMARY,
                    mt: 0.2,
                  }}
                >
                  Cart
                </Typography>
              </Box>

              {/* More / hamburger on mobile */}
              <IconButton
                sx={{ color: PRIMARY, display: { xs: "flex", md: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* ── Row 2: Category nav ─────────────────────────────────────── */}
        <Box sx={{ background: PRIMARY, display: { xs: "none", md: "block" } }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.label}
                  onMouseEnter={() => cat.children && setOpenDrop(cat.label)}
                  onMouseLeave={() => setOpenDrop(null)}
                  sx={{ position: "relative" }}
                >
                  <Box
                    component="a"
                    href={cat.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.3,
                      px: 1.6,
                      py: 1.4,
                      color: "rgba(255,255,255,0.88)",
                      fontSize: "0.78rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s",
                      "&:hover": { color: "#FFD18C" },
                    }}
                  >
                    {cat.label}
                    {cat.children && (
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize: 14,
                          transition: "transform 0.2s",
                          transform:
                            openDrop === cat.label ? "rotate(180deg)" : "none",
                        }}
                      />
                    )}
                  </Box>

                  {/* Dropdown */}
                  {cat.children && openDrop === cat.label && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        background: "#FFFFFF",
                        border: "1px solid #EBEBEB",
                        borderRadius: "0 0 8px 8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        minWidth: 180,
                        zIndex: 1300,
                        py: 0.5,
                        animation: "fadeDown 0.18s ease",
                        "@keyframes fadeDown": {
                          from: { opacity: 0, transform: "translateY(-6px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      {cat.children.map((child) => (
                        <Box
                          key={child}
                          component="a"
                          href="#"
                          sx={{
                            display: "block",
                            px: 2,
                            py: 1,
                            fontSize: "0.82rem",
                            fontFamily: "'DM Sans', sans-serif",
                            color: "#1A1A1A",
                            textDecoration: "none",
                            "&:hover": { background: "#FFF5EC", color: ACCENT },
                          }}
                        >
                          {child}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </AppBar>

      {/* ── Mobile Drawer ────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, background: "#FAFAF8" } }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "1.2rem",
                color: ACCENT,
              }}
            >
              Ghorer Bazar
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mobile search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ fontSize: 18, color: PRIMARY }} />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            {categories.map((cat) => (
              <ListItem
                key={cat.label}
                component="a"
                href={cat.href}
                sx={{
                  py: 1.3,
                  px: 0,
                  borderBottom: "1px solid #F0EFE9",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ListItemText
                  primary={cat.label}
                  primaryTypographyProps={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    color: PRIMARY,
                  }}
                />
                {cat.children && (
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#999" }} />
                )}
              </ListItem>
            ))}
          </List>

          <Box
            sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            <Button
              fullWidth
              variant="contained"
              href="/login"
              sx={{
                background: PRIMARY,
                "&:hover": { background: "#0F2820" },
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="outlined"
              href="/signup"
              sx={{
                borderColor: PRIMARY,
                color: PRIMARY,
                "&:hover": { background: "#F0FFF8", borderColor: PRIMARY },
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
