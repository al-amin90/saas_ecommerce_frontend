"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  TextField,
  InputAdornment,
  Divider,
  Collapse,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { PersonPinCircleOutlined } from "@mui/icons-material";

const navLinks = [
  { label: "New Arrivals", href: "#new" },
  {
    label: "Shop",
    href: "#shop",
    children: ["Running", "Casual", "Boots", "Heels", "Sandals"],
  },
  { label: "Brands", href: "#brands" },
  { label: "Sale", href: "#sale", highlight: true },
  { label: "About", href: "#about" },
];

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      {/* Top announcement bar */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(250, 250, 248, 0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #EBEBEB",
          color: "#1A1A1A",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ py: 1, px: { xs: 0, md: 0 }, minHeight: { xs: 64, md: 72 } }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 4 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  background: "#1A1A1A",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ color: "#C8A97E", fontSize: "1.2rem", lineHeight: 1 }}
                >
                  S
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                  display: { xs: "none", sm: "block" },
                }}
              >
                SOLE<span style={{ color: "#C8A97E" }}>CRAFT</span>
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
                flex: 1,
              }}
            >
              {navLinks.map((link) => (
                <Box key={link.label} sx={{ position: "relative" }}>
                  {link.children ? (
                    <Button
                      endIcon={
                        <KeyboardArrowDownIcon
                          sx={{ fontSize: "1rem !important" }}
                        />
                      }
                      sx={{
                        color: "#1A1A1A",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        px: 2,
                        py: 1,
                        background: "transparent",
                        "&:hover": {
                          color: "#C8A97E",
                          background: "transparent",
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  ) : (
                    <Button
                      href={link.href}
                      sx={{
                        color: link.highlight ? "#C8A97E" : "#1A1A1A",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: link.highlight ? 700 : 600,
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        px: 2,
                        py: 1,
                        background: "transparent",
                        "&:hover": {
                          color: "#C8A97E",
                          background: "transparent",
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  )}
                </Box>
              ))}
            </Box>

            {/* Right actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: "auto",
              }}
            >
              {/* Search bar (desktop) */}
              <Collapse in={searchOpen} orientation="horizontal">
                <TextField
                  placeholder="Search shoes..."
                  size="small"
                  autoFocus
                  sx={{
                    width: 220,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.85rem",
                      fontFamily: "'DM Sans', sans-serif",
                    },
                  }}
                  inputprops={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchOpen(false)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Collapse>

              <IconButton
                size="small"
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{ color: "#1A1A1A", "&:hover": { color: "#C8A97E" } }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: "#1A1A1A",
                  "&:hover": { color: "#C8A97E" },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <PersonPinCircleOutlined fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{ color: "#1A1A1A", "&:hover": { color: "#C8A97E" } }}
              >
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon fontSize="small" />
                </Badge>
              </IconButton>

              <IconButton
                size="small"
                sx={{ color: "#1A1A1A", "&:hover": { color: "#C8A97E" } }}
              >
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>

              {/* Mobile menu */}
              <IconButton
                sx={{ display: { xs: "flex", md: "none" }, color: "#1A1A1A" }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
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
              variant="h6"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              SOLE<span style={{ color: "#C8A97E" }}>CRAFT</span>
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            placeholder="Search shoes..."
            fullWidth
            size="small"
            sx={{ mb: 3 }}
            inputprops={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                button
                sx={{
                  py: 1.5,
                  px: 0,
                  borderBottom: "1px solid #F0EFE9",
                  color: link.highlight ? "#C8A97E" : "#1A1A1A",
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 1.5 }}
            >
              Sign In
            </Button>
            <Button fullWidth variant="outlined">
              Create Account
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
