import { headers } from "next/headers";
import Head from "next/head";
import ShopSection from "../../components/home/ShopSection";
import BrandsSection from "../../components/home/BrandsSection";
import ImageSlider from "../../components/home/ImageSlider";
import CartBadge from "@/src/components/shared/CartBadge";
import { IBanner } from "@/src/interface/dashboard/dashboard";

const resolveTenantId = async (): Promise<string> => {
  const tenantType = process.env.NEXT_PUBLIC_TENANCY_TYPE;

  if (tenantType === "single") {
    return "bazar";
  }

  const host = (await headers()).get("host") ?? "";
  return host.split(".")[0] || "bazar";
};

const getActiveBanners = async (): Promise<IBanner[]> => {
  const tenantId = await resolveTenantId();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_SITE_URL}/api/v1/banner/active`,
      {
        cache: "force-cache",
        headers: { "x-tenant": tenantId },
        next: { revalidate: 60 * 60 * 24 },
      },
    );
    console.log("res", res);

    if (!res.ok) {
      console.error("Failed to fetch banners:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    console.log("json", json);
    return json?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
};

export default async function HomePage() {
  const banners = await getActiveBanners();

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
      <ImageSlider banners={banners} />

      {/* Main Shop Section */}
      <ShopSection />

      {/* Brands */}
      <BrandsSection />
    </>
  );
}
