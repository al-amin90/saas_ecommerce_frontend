"use client";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { FaFacebookSquare } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaTwitterSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const footerLinks = {
  Shop: [
    "New Arrivals",
    "Running Shoes",
    "Casual Shoes",
    "Boots",
    "Heels & Pumps",
    "Sandals",
    "Sale",
  ],
  Help: [
    "My Account",
    "Track Order",
    "Returns & Exchanges",
    "Shipping Policy",
    "Size Guide",
    "FAQ",
  ],
  Company: [
    "About Us",
    "Careers",
    "Press",
    "Sustainability",
    "Affiliates",
    "Blog",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand column - 4 columns on desktop */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative rounded-full w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex-shrink-0 ">
                <Image
                  src="/logo.jpeg"
                  fill
                  className="object-contain rounded-full"
                  alt="Logo"
                />
              </div>
              <div className="font-['Syne'] font-extrabold tracking-[-0.02em]  text-2xl">
                KidsHut <span className="text-[#1A3C34]">BD</span>
              </div>
            </Link>

            <p className="text-white/60 font-['DM_Sans'] text-base leading-relaxed max-w-xs">
              Bangladesh's premier destination for authentic international
              footwear. Quality, style, and comfort delivered to your door.
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: <Phone className="w-5 h-5" />,
                  text: "+880 1314-244407",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  text: "info@kidshutbd.com",
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  text: "Shop No: 464, Level 4 Shyamoli Square Shopping Mall Shyamoli, Mirpur Road Mohammadpur, Thana Dhaka 1207, Dhaka, Bangladesh, 1207",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start  gap-3">
                  <div className="text-[#1A3C34] flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-white/70 text-sm font-['DM_Sans']">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-4">
              {[
                {
                  icon: <FaFacebookSquare />,
                  label: "Facebook",
                  link: "https://www.facebook.com/profile.php?id=61578258556224",
                },
                {
                  icon: <PiInstagramLogoFill />,
                  label: "Instagram",
                  link: "/",
                },
                { icon: <FaTwitterSquare />, label: "Twitter", link: "/" },
                { icon: <FaYoutube />, label: "YouTube", link: "/" },
              ].map((s) => (
                <Link
                  href={s.link}
                  key={s.label}
                  target="_blank"
                  aria-label={s.label}
                  className="bg-white/10 cursor-pointer text-white/70 hover:bg-[#E07B1A] hover:text-[#1A1A1A] transition-all duration-200 p-3 rounded-md"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-6 sm:col-span-4 md:col-span-2">
              <h3 className="font-['Syne'] font-bold text-sm tracking-[0.12em] uppercase text-white mb-6">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/60 hover:text-[#1A3C34] text-base font-['DM_Sans'] transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-sm font-['DM_Sans'] text-center sm:text-left">
            © {new Date().getFullYear()} SoleCraft Bangladesh. All rights
            reserved.
          </p>

          <div className="flex gap-6 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-white/50 hover:text-[#1A3C34] text-sm font-['DM_Sans'] transition-colors duration-200"
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          {/* Payment methods */}
          <div className="flex gap-3 items-center flex-wrap">
            {["bKash", "Nagad", "VISA", "MasterCard"].map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 bg-white/10 rounded-md text-sm font-['Syne'] font-bold text-white/70 tracking-[0.05em]"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
