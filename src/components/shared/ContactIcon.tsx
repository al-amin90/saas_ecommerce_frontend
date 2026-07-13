import Link from "next/link";
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";

const contactLinks = [
  {
    label: "WhatsApp",
    href: "https://wa.me/8801314244407",
    icon: <FaWhatsapp className="h-6 w-6" />,
    className: "bg-[#25D366] text-white",
  },
  {
    label: "Messenger",
    href: "https://www.facebook.com/profile.php?id=61578258556224",
    icon: <FaFacebookMessenger className="h-6 w-6" />,
    className: "bg-[#0084FF] text-white",
  },
];

const ContactIcon = () => {
  return (
    <div>
      <div className="fixed bottom-4 right-1 z-60 flex flex-col gap-3 md:bottom-6 md:right-6">
        {contactLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-105 ${item.className}`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactIcon;
