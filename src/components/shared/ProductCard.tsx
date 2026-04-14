"use client";

import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Rating,
  Tooltip,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid #EBEBEB",
        background: "#FFFFFF",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image container */}
      <Box
        sx={{ position: "relative", overflow: "hidden", background: "#F7F6F2" }}
      >
        <CardMedia
          component="img"
          height="280"
          image={product.image}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Badge */}
        {product.badge && (
          <Chip
            label={product.badge}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              background: product.badgeColor,
              color: "#FFFFFF",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              height: 22,
              zIndex: 1,
            }}
          />
        )}

        {/* Discount badge */}
        {discount && (
          <Box
            sx={{
              position: "absolute",
              top: product.badge ? 40 : 12,
              left: 12,
              background: "#E53935",
              color: "#FFFFFF",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              px: 1,
              py: 0.3,
              borderRadius: "2px",
            }}
          >
            -{discount}%
          </Box>
        )}

        {/* Action icons */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            transform: hovered ? "translateX(0)" : "translateX(50px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.3s ease",
          }}
        >
          <Tooltip
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            placement="left"
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted(!wishlisted);
              }}
              sx={{
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                color: wishlisted ? "#E53935" : "#1A1A1A",
                "&:hover": { background: "#FFF", transform: "scale(1.1)" },
              }}
            >
              {wishlisted ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick view" placement="left">
            <IconButton
              size="small"
              sx={{
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                color: "#1A1A1A",
                "&:hover": { background: "#FFF", transform: "scale(1.1)" },
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Add to cart overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <Button
            fullWidth
            onClick={handleAddToCart}
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{
              background: addedToCart ? "#4CAF50" : "#1A1A1A",
              color: "#FFFFFF",
              borderRadius: 0,
              py: 1.2,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              "&:hover": { background: "#C8A97E" },
              transition: "background 0.3s ease",
            }}
          >
            {addedToCart ? "Added!" : "Add to Bag"}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Brand */}
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.72rem",
            color: "#C8A97E",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          {product.brand}
        </Typography>

        {/* Name */}
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1A1A1A",
            lineHeight: 1.3,
            mb: 1,
            flex: 1,
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <Rating
            value={product.rating}
            precision={0.1}
            size="small"
            readOnly
            sx={{ "& .MuiRating-iconFilled": { color: "#C8A97E" } }}
          />
          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "#6B6B6B",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ({product.reviews})
          </Typography>
        </Box>

        {/* Colors */}
        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
          {product.colors.map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: color,
                border: "1.5px solid #EBEBEB",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.3)",
                  transition: "transform 0.2s",
                },
              }}
            />
          ))}
        </Box>

        {/* Price */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#1A1A1A",
            }}
          >
            ৳{product.price.toLocaleString()}
          </Typography>
          {product.originalPrice && (
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "#B0B0B0",
                textDecoration: "line-through",
              }}
            >
              ৳{product.originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
