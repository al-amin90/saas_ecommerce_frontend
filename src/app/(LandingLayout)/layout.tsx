import CartBadge from "@/src/components/shared/CartBadge";
import Navbar from "@/src/components/shared/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <CartBadge />

      <main> {children}</main>
    </div>
  );
};

export default LandingLayout;
