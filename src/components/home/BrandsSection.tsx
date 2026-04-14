"use client";

const brandLogos = [
  {
    name: "Nike",
    style: { fontWeight: 900, fontSize: "2.5rem", letterSpacing: "-0.02em" },
  },
  {
    name: "Adidas",
    style: { fontWeight: 800, fontSize: "1.8rem", letterSpacing: "0.1em" },
  },
  {
    name: "New Balance",
    style: { fontWeight: 800, fontSize: "1.5rem", letterSpacing: "0.05em" },
  },
  {
    name: "Timberland",
    style: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "0.08em" },
  },
  {
    name: "Vans",
    style: { fontWeight: 900, fontSize: "2.2rem", letterSpacing: "0.15em" },
  },
  {
    name: "Clarks",
    style: { fontWeight: 700, fontSize: "1.7rem", letterSpacing: "0.05em" },
  },
  {
    name: "Birkenstock",
    style: { fontWeight: 600, fontSize: "1.3rem", letterSpacing: "0.12em" },
  },
  {
    name: "Skechers",
    style: { fontWeight: 800, fontSize: "1.6rem", letterSpacing: "0.05em" },
  },
];

export default function BrandsSection() {
  return (
    <section
      id="brands"
      className="py-16 md:py-28 bg-[#F7F6F2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center font-['DM_Sans'] text-sm font-semibold tracking-[0.25em] uppercase text-gray-400 mb-12">
          Our Premium Brand Partners
        </p>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-[#F7F6F2] to-transparent z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-[#F7F6F2] to-transparent z-10" />

        {/* Marquee container */}
        <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
          {[...brandLogos, ...brandLogos].map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#C8A97E] select-none"
              style={{
                ...brand.style,
                color: "#D0CFC8",
                fontFamily: "'Syne', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>

      {/* Add this to your tailwind.config.ts or global CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
