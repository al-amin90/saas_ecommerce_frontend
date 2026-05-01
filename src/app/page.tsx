import Head from "next/head";
import Image from "next/image";
import { products } from "../data/products";
import ShopSection from "../components/home/ShopSection";
import BrandsSection from "../components/home/BrandsSection";
import Footer from "../components/shared/Footer";
import ProductCard from "../components/shared/ProductCard";
import ImageSlider from "../components/home/ImageSlider";
import Navbar from "../components/shared/Navbar";

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

      {/* Hero Slider */}
      <ImageSlider />

      {/* Main Shop Section */}
      <ShopSection />

      {/* Brands */}
      <BrandsSection />

      <Footer />
    </>
  );
}
