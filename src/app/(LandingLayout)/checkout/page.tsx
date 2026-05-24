/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/src/redux/features/cart/cartSlice";
import { usePostDynamicMutation } from "@/src/redux/features/dynamic/dynamicApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  BD_CITIES,
  DHAKA_CHARGE,
  OUTSIDE_DHAKA_CHARGE,
} from "@/src/utils/delivaryCharge";
import { Search } from "lucide-react";

// ── Schema ────────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  paymentMethod: z.enum(["cash", "online"]).default("cash"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
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
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
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

  const grandTotal = totalPrice + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-400">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <Button onClick={() => router.push("/products")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const onSubmit = async (form: CheckoutForm) => {
    const payload = {
      guestCheckout: true,
      guestEmail: form.email,
      guestInfo: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price:
          item.price > (item?.discountPrice || 0)
            ? Math.round(item.price - (item.discountPrice || 0))
            : item.price,
        selectedSize: String(item.size),
        colorId: item.colorId._id,
      })),
      totalPrice: grandTotal,
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await createOrder({
        url: "order",
        data: payload,
        invalidatesTags: [{ type: "singleProduct" }],
      }).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderId=${(res as any)?.data?._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.log("error", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  const formFields = [
    {
      name: "fullName" as const,
      label: "Full Name",
      placeholder: "আহমেদ হোসেন",
    },
    { name: "email" as const, label: "Email", placeholder: "you@example.com" },
    { name: "phone" as const, label: "Phone", placeholder: "01XXXXXXXXX" },
    {
      name: "address" as const,
      label: "Address",
      placeholder: "House, Road, Area",
    },
    { name: "city" as const, label: "City", placeholder: "Kushtia" },
    { name: "postalCode" as const, label: "Postal Code", placeholder: "1205" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        >
          {/* ── Left: Form ── */}
          <div className="space-y-5 bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Delivery Information
            </h2>

            {[
              {
                name: "fullName" as const,
                label: "Full Name",
                placeholder: "আহমেদ হোসেন",
              },
              {
                name: "email" as const,
                label: "Email",
                placeholder: "you@example.com",
              },
              {
                name: "phone" as const,
                label: "Phone",
                placeholder: "01XXXXXXXXX",
              },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <Label className="text-sm text-slate-600">{f.label}</Label>
                <Input
                  {...register(f.name)}
                  placeholder={f.placeholder}
                  className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black"
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
                  onBlur={() =>
                    setTimeout(() => setCityDropdownOpen(false), 150)
                  }
                  placeholder="Search city..."
                  className="w-full h-9 pl-8 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-black rounded-lg outline-none text-slate-800 dark:text-white"
                />
              </div>

              {/* Hidden RHF field */}
              <input type="hidden" {...register("city")} />

              {/* Dropdown */}
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

            {[
              {
                name: "address" as const,
                label: "Address",
                placeholder: "House, Road, Area",
              },

              {
                name: "postalCode" as const,
                label: "Postal Code",
                placeholder: "1205",
              },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <Label className="text-sm text-slate-600">{f.label}</Label>
                <Input
                  {...register(f.name)}
                  placeholder={f.placeholder}
                  className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black"
                />
                {errors[f.name] && (
                  <p className="text-xs text-red-500">
                    {errors[f.name]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-600">Payment Method</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "cash", label: "Cash on Delivery" },
                  // { value: "online", label: "Online Payment" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "paymentMethod",
                        opt.value as CheckoutForm["paymentMethod"],
                      )
                    }
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      selectedPayment === opt.value
                        ? "border-black bg-black text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-xs text-red-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Order Summary
              </h2>

              {cartItems.map((item, i) => {
                const discountedPrice =
                  item.price > (item.discountPrice || 0)
                    ? Math.round(item.price - (item.discountPrice || 0))
                    : item.price;

                return (
                  <div key={i} className="flex gap-3 items-center">
                    {item.productImage ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-400">
                        Size: {item.size} · Color: {item.colorId.name} · Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 flex-shrink-0">
                      Tk {(discountedPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}

              {/* Total section — cartItems এর পরে */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>
                    Delivery
                    {selectedCity && (
                      <span className="ml-1 text-xs">
                        (
                        {selectedCity.toLowerCase() === "dhaka"
                          ? "Inside"
                          : "Outside"}{" "}
                        Dhaka)
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      deliveryChargeEdited
                        ? "text-orange-500"
                        : "text-emerald-600"
                    }
                  >
                    ৳{deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-sm"
            >
              {isLoading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
