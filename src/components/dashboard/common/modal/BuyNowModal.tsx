/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Zap } from "lucide-react";
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
import { IColor } from "@/src/interface/dashboard/dashboard";
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

// ── Props ─────────────────────────────────────────────────────────────────────

interface BuyNowModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  productName: string;
  price: number;
  discountPrice: number;
  selectedSize: number;
  selectedColor: IColor;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BuyNowModal({
  open,
  onOpenChange,
  productId,
  productName,
  price,
  selectedSize,
  selectedColor,
  quantity,
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
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buyNowSchema),
    defaultValues: { paymentMethod: "cash" },
  });

  const selectedPayment = watch("paymentMethod");

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

  const grandTotal = selectedCity ? price + deliveryCharge : price;

  const onSubmit = async (form: BuyNowForm) => {
    const payload = {
      guestCheckout: true,
      guestEmail: form.email,
      guestInfo: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
      },
      items: [
        {
          productId,
          quantity,
          price: price,
          selectedSize: String(selectedSize),
          colorId: selectedColor._id,
        },
      ],
      totalPrice: price * quantity + deliveryCharge,
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

        {/* Order mini summary */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
            {productName}
          </p>
          <p className="text-xs text-slate-400">
            Size: {selectedSize} · Color: {selectedColor?.name} · Qty:{" "}
            {quantity}
          </p>
          <div className="flex items-center gap-6 pt-1">
            <span className="text-base  font-bold text-slate-800 dark:text-white">
              Tk: {(price * quantity).toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              Delivery Charge: {selectedCity && deliveryCharge.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {[
            {
              name: "fullName" as const,
              label: "Full Name",
              placeholder: "আহমেদ হোসেন",
            },
            // {
            //   name: "email" as const,
            //   label: "Email",
            //   placeholder: "you@example.com",
            // },
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
                {selectedCity && (
                  <span className="text-xs text-slate-400">
                    {selectedCity.toLowerCase() === "dhaka"
                      ? "Inside Dhaka"
                      : "Outside Dhaka"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={deliveryCharge}
                    disabled={true}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        setDeliveryCharge(val);
                        setDeliveryChargeEdited(true);
                      }
                    }}
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
              {deliveryChargeEdited && (
                <p className="text-xs text-orange-500">
                  ⚠ Custom delivery charge applied
                </p>
              )}
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

          {/* Payment method */}
          {/* <div className="space-y-2">
            <Label className="text-sm text-slate-600 dark:text-slate-300">
              Payment Method
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "cash", label: "Cash on Delivery" },
                { value: "online", label: "Online Payment", disabled: true },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "paymentMethod",
                      opt.value as BuyNowForm["paymentMethod"],
                    )
                  }
                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    selectedPayment === opt.value
                      ? "border-black bg-black text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div> */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`relative animate-pulse-glow  cursor-pointer
    hover:animate-none
    transition-all duration-300 w-full h-12 rounded-xl text-sm font-semibold overflow-hidden group ${
      isLoading
        ? "bg-slate-700 text-slate-300 cursor-not-allowed"
        : "bg-gradient-to-r from-black via-slate-800 to-black  hover:shadow-2xl hover:shadow-black/30 text-white"
    }`}
          >
            {/* Animated shimmer effect */}
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
