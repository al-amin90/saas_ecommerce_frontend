/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Zap } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePostDynamicMutation } from "@/src/redux/features/dynamic/dynamicApi";
import { toast } from "sonner";
import { useState } from "react";
import {
  BD_CITIES,
  DHAKA_CHARGE,
  OUTSIDE_DHAKA_CHARGE,
} from "@/src/utils/delivaryCharge";

// ── Schema ────────────────────────────────────────────────────────────────────

const buyNowSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cash", "online"]).refine((val) => val === "cash", {
    message: "Online payment is not available right now",
  }),
});

type BuyNowForm = z.infer<typeof buyNowSchema>;

// ── Types ─────────────────────────────────────────────────────────────────────

interface VariantLite {
  _id: string;
  imageIndex: number;
  color: { _id: string; name: string; color: string };
}

interface SelectedItem {
  variantId: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  image: string;
  size: string;
  quantity: number;
}

interface BuyNowModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  productName: string;
  price: number;
  images: string[];
  variants: VariantLite[];
  sizeQuantities: Record<string, { size: string; quantity: number }[]>;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BuyNowModal({
  open,
  onOpenChange,
  productId,
  productName,
  images,
  variants,
  sizeQuantities,
  price,
}: BuyNowModalProps) {
  const router = useRouter();
  const [createOrder, { isLoading }] = usePostDynamicMutation();

  //   delivary charge
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(OUTSIDE_DHAKA_CHARGE);
  const [deliveryChargeEdited, setDeliveryChargeEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buyNowSchema),
    defaultValues: { paymentMethod: "cash" },
  });

  // ── Flatten every selected variant/size into one list ──────────────────────
  const selectedItems: SelectedItem[] = Object.entries(sizeQuantities).flatMap(
    ([variantId, sizes]) => {
      const variant = variants.find((v) => v._id === variantId);
      const image =
        (variant ? images[variant.imageIndex] : undefined) || images[0] || "";

      return sizes
        .filter((s) => s.quantity > 0)
        .map((s) => ({
          variantId,
          colorId: variant?.color._id ?? "",
          colorName: variant?.color.name ?? "",
          colorHex: variant?.color.color ?? "",
          image,
          size: s.size,
          quantity: s.quantity,
        }));
    },
  );

  const totalQuantity = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const itemsTotal = selectedItems.reduce(
    (sum, i) => sum + price * i.quantity,
    0,
  );
  const grandTotal = itemsTotal + (selectedCity ? deliveryCharge : 0);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setValue("city", city);
    setCitySearch(city);
    setCityDropdownOpen(false);

    // delivery charge auto-set — manually edited হলে touch করবো না
    if (!deliveryChargeEdited) {
      setDeliveryCharge(
        city.toLowerCase() === "dhaka" ? DHAKA_CHARGE : OUTSIDE_DHAKA_CHARGE,
      );
    }
  };

  const filteredCities = BD_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const onSubmit = async (form: BuyNowForm) => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    const payload = {
      guestCheckout: true,
      guestEmail: form.email,
      guestInfo: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
      },
      items: selectedItems.map(({ size, quantity, colorId, image }) => ({
        productId,
        quantity,
        price,
        image,
        selectedSize: String(size),
        colorId,
      })),
      totalPrice: itemsTotal + deliveryCharge,
      paymentMethod: form.paymentMethod,
    };

    console.log("payload", payload);

    try {
      const res = await createOrder({
        url: "order",
        data: payload,
        invalidatesTags: [{ type: "singleProduct" }],
      }).unwrap();
      toast.success("Order placed!");
      reset();
      onOpenChange(false);
      router.push(`/order-success?orderId=${(res as any)?.data?._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { errorSources: { message?: string }[] } };
      console.log(err);
      toast.error(
        error?.data?.errorSources[0]?.message || "Failed to place order",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Quick Checkout
          </DialogTitle>
        </DialogHeader>

        {/* Order mini summary — ALL selected images/sizes/colors */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
            {productName}
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedItems.map((item) => (
              <div
                key={`${item.variantId}-${item.size}`}
                className="flex items-center gap-3"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.colorName || "variant"}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {item.colorName}
                    </span>
                    <span className="text-xs text-slate-400">
                      · Size {item.size}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Qty: {item.quantity} · Tk{" "}
                    {(price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {selectedItems.length === 0 && (
              <p className="text-xs text-slate-400">No items selected.</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">
              {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
            </span>
            <div className="text-right">
              <p className="text-base font-bold text-slate-800 dark:text-white">
                Tk {itemsTotal.toLocaleString()}
              </p>
              {selectedCity && (
                <p className="text-xs text-slate-400">
                  + Delivery Tk {deliveryCharge.toLocaleString()} ={" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Tk {grandTotal.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {[
            {
              name: "fullName" as const,
              label: "Full Name",
              placeholder: "আহমেদ হোসেন",
            },
            {
              name: "phone" as const,
              label: "Phone",
              placeholder: "01XXXXXXXXX",
            },
          ].map((f) => (
            <div key={f.name} className="space-y-1">
              <Label className="text-sm text-slate-600 dark:text-slate-300">
                {f.label}
              </Label>
              <Input
                {...register(f.name)}
                placeholder={f.placeholder}
                className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-black rounded-lg"
              />
              {errors[f.name] && (
                <p className="text-xs text-red-500">
                  {errors[f.name]?.message}
                </p>
              )}
            </div>
          ))}

          {/* City — Search Dropdown */}
          <div className="space-y-1 relative">
            <Label className="text-xs text-slate-600 dark:text-slate-400">
              City
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setCityDropdownOpen(true);
                  if (!e.target.value) {
                    setSelectedCity("");
                    setValue("city", "");
                  }
                }}
                onFocus={() => setCityDropdownOpen(true)}
                onBlur={() => setTimeout(() => setCityDropdownOpen(false), 150)}
                placeholder="Search city..."
                className="w-full h-9 pl-8 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-black rounded-lg outline-none text-slate-800 dark:text-white"
              />
            </div>

            <input type="hidden" {...register("city")} />

            {cityDropdownOpen && filteredCities.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onMouseDown={() => handleCitySelect(city)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      selectedCity === city
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{city}</span>
                    {city.toLowerCase() === "dhaka" && (
                      <span className="ml-2 text-xs text-emerald-600 font-medium">
                        ৳{DHAKA_CHARGE} delivery
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Delivery Charge */}
          {selectedCity && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  Delivery Charge
                </Label>
                <span className="text-xs text-slate-400">
                  {selectedCity.toLowerCase() === "dhaka"
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={deliveryCharge}
                    disabled
                    className="w-full h-9 pl-7 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-black rounded-lg outline-none text-slate-800 dark:text-white"
                  />
                </div>
                {deliveryChargeEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      const charge =
                        selectedCity.toLowerCase() === "dhaka"
                          ? DHAKA_CHARGE
                          : OUTSIDE_DHAKA_CHARGE;
                      setDeliveryCharge(charge);
                      setDeliveryChargeEdited(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {[
            {
              name: "address" as const,
              label: "Address",
              placeholder: "House, Road, Area, City",
            },
          ].map((f) => (
            <div key={f.name} className="space-y-1">
              <Label className="text-sm text-slate-600 dark:text-slate-300">
                {f.label}
              </Label>
              <Input
                {...register(f.name)}
                placeholder={f.placeholder}
                className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-black rounded-lg"
              />
              {errors[f.name] && (
                <p className="text-xs text-red-500">
                  {errors[f.name]?.message}
                </p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={isLoading || selectedItems.length === 0}
            className={`relative animate-pulse-glow cursor-pointer
    hover:animate-none
    transition-all duration-300 w-full h-12 rounded-xl text-sm font-semibold overflow-hidden group ${
      isLoading
        ? "bg-slate-700 text-slate-300 cursor-not-allowed"
        : "bg-gradient-to-r bg-[#FF6900] hover:shadow-2xl hover:shadow-black/30 text-white"
    }`}
          >
            {!isLoading && (
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
            <span className="underline-animation" />

            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Placing Order...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  Order Now - Cash On Delivery
                </>
              )}
            </span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
