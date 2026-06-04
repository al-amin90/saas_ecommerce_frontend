import CartBadge from "@/src/components/shared/CartBadge";
import Footer from "@/src/components/shared/Footer";
import Navbar from "@/src/components/shared/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <CartBadge />

      <main> {children}</main>

      <Footer />
    </div>
  );
};

export default LandingLayout;
