"use client";
import {
  Box,
  Container,
  Typography,
  Grid,
  Rating,
  Avatar,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const testimonials = [
  {
    name: "Arif Rahman",
    location: "Dhaka",
    avatar: "AR",
    rating: 5,
    review:
      "The quality of shoes from SoleCraft is unmatched. I ordered the Urban Stride Runner and it arrived within 2 days. Fits perfectly and looks even better in person!",
    product: "Urban Stride Runner",
  },
  {
    name: "Nadia Islam",
    location: "Chittagong",
    avatar: "NI",
    rating: 5,
    review:
      "Finally found a shoe store in Bangladesh that carries authentic international brands. The Velvet Heel Pump is stunning. Will definitely order again!",
    product: "Velvet Heel Pump",
  },
  {
    name: "Karim Hossain",
    location: "Sylhet",
    avatar: "KH",
    rating: 5,
    review:
      "Amazing experience from browsing to delivery. The Altitude Boots are premium quality and the packaging was perfect. Customer service was very responsive too.",
    product: "Altitude Boot Pro",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, background: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#C8A97E",
              mb: 1.5,
            }}
          >
            Customer Stories
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            What Our Customers Say
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((t, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  p: 4,
                  background: "#FAFAF8",
                  border: "1px solid #EBEBEB",
                  borderRadius: "4px",
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
                    transform: "translateY(-4px)",
                    borderColor: "#C8A97E",
                  },
                }}
              >
                <FormatQuoteIcon
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    fontSize: 40,
                    color: "#EBEBEB",
                  }}
                />

                <Rating
                  value={t.rating}
                  readOnly
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiRating-iconFilled": { color: "#C8A97E" },
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.8,
                    color: "#4A4A4A",
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  "{t.review}"
                </Typography>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: "1px solid #EBEBEB",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      background: "#1A1A1A",
                      color: "#C8A97E",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      width: 36,
                      height: 36,
                    }}
                  >
                    {t.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#1A1A1A",
                      }}
                    >
                      {t.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem",
                        color: "#B0B0B0",
                      }}
                    >
                      {t.location} • {t.product}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
