import Navbar from "@/src/components/shared/Navbar";
import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* Navbar */}
      <Navbar cartCount={2} wishlistCount={3} />
      <main> {children}</main>
    </div>
  );
};

export default LandingLayout;
