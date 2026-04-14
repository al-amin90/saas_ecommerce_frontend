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

      {/* Category Banners */}
      {/* <CategoryBanners /> */}

      {/* Main Shop Section */}
      <ShopSection />

      {/* Brands */}
      <BrandsSection />

      {/* Testimonials */}
      {/* <Testimonials /> */}

      {/* Newsletter */}
      {/* <Newsletter /> */}

      <Footer />
    </>
  );
}
