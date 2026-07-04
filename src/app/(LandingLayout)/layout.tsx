import CartBadge from "@/src/components/shared/CartBadge";
import ContactIcon from "@/src/components/shared/ContactIcon";
import Footer from "@/src/components/shared/Footer";
import Navbar from "@/src/components/shared/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <CartBadge />

      <main>{children}</main>

      <ContactIcon />

      <Footer />
    </div>
  );
};

export default LandingLayout;
