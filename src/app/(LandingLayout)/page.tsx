import Head from "next/head";
import ShopSection from "../../components/home/ShopSection";
import BrandsSection from "../../components/home/BrandsSection";
import ImageSlider from "../../components/home/ImageSlider";
import CartBadge from "@/src/components/shared/CartBadge";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>KidsHut BD — Premium Footwear Bangladesh</title>
        <meta
          name="description"
          content="Bangladesh's premier shoe store. Shop authentic Nike, Adidas, Timberland, and more. Free delivery on orders over ৳3,000."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CartBadge />

      {/* Hero Slider */}
      <ImageSlider />

      {/* Main Shop Section */}
      <ShopSection />

      {/* Brands */}
      <BrandsSection />
    </>
  );
}
