import Head from "next/head";
import ShopSection from "../components/home/ShopSection";
import BrandsSection from "../components/home/BrandsSection";
import Footer from "../components/shared/Footer";
import ImageSlider from "../components/home/ImageSlider";
import Navbar from "@/src/components/shared/Navbar";
import CartBadge from "@/src/components/shared/CartBadge";

export default function HomePage() {
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

      <Navbar cartCount={2} wishlistCount={3} />
      <CartBadge itemCount={0} totalPrice={0} />

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
