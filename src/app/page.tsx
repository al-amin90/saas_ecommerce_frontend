import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/shared/Navbar";
import HeroSlider from "../components/home/ImageSlider";
import FeaturesBar from "../components/shared/FeaturesBar";
import CategoryBanners from "../components/home/CategoryBanners";
import { products } from "../data/products";
import ShopSection from "../components/home/ShopSection";
import BrandsSection from "../components/home/BrandsSection";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/shared/Footer";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import ProductCard from "../components/shared/ProductCard";
import ImageSlider from "../components/home/ImageSlider";

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <>
      <Head>
        <title>SoleCraft — Premium Footwear Bangladesh</title>
        <meta
          name="description"
          content="Bangladesh's premier shoe store. Shop authentic Nike, Adidas, Timberland, and more. Free delivery on orders over ৳3,000."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <Navbar cartCount={2} wishlistCount={3} />

      {/* Hero Slider */}
      <ImageSlider />

      {/* Features Bar */}
      <FeaturesBar />

      {/* Category Banners */}
      <CategoryBanners />

      {/* Featured Products */}
      <Box id="new" sx={{ py: { xs: 6, md: 10 }, background: "#FFFFFF" }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 5,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
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
                Curated for You
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Featured Collection
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              href="#shop"
              sx={{ fontWeight: 700, fontSize: "0.78rem" }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Promo Banner */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #C8A97E 0%, #A8835A 100%)",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                  mb: 0.5,
                }}
              >
                Limited Time Offer
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                End of Season Sale — Up to 40% Off
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              href="#sale"
              sx={{
                background: "#1A1A1A",
                color: "#FFFFFF",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "0.78rem",
                "&:hover": { background: "#000000" },
                flexShrink: 0,
              }}
            >
              Shop the Sale
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Shop Section */}
      <ShopSection />

      {/* Brands */}
      <BrandsSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
}
