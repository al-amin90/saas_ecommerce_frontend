"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/src/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { usePostDynamicMutation } from "@/src/redux/features/dynamic/dynamicApi";
import {
  BD_CITIES,
  DHAKA_CHARGE,
  OUTSIDE_DHAKA_CHARGE,
} from "@/src/utils/delivaryCharge";

// ── Schema ────────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cash", "online"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);
  const [createOrder, { isLoading }] = usePostDynamicMutation();

  // Delivery charge state
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryChargeEdited] = useState(false);

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
    setDeliveryCharge(
      city.toLowerCase() === "dhaka" ? DHAKA_CHARGE : OUTSIDE_DHAKA_CHARGE,
    );
  };

  const filteredCities = BD_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0,
  );
  const grandTotal = totalPrice + deliveryCharge;

  const onSubmit = async (form: CheckoutForm) => {
    const payload = {
      guestCheckout: true,
      guestEmail: form.email,
      guestInfo: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price:
          item.price > (item?.discountPrice || 0)
            ? Math.round(item.price - (item.discountPrice || 0))
            : item.price,
        selectedSize: String(item.size),
        image: item.productImage,
        colorId: item.colorId._id,
      })),
      totalPrice: grandTotal,
      paymentMethod: form.paymentMethod,
    };

    console.log("payload", payload);

    try {
      const res = await createOrder({
        url: "order",
        data: payload,
        invalidatesTags: [{ type: "singleProduct" }],
      }).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/order-success?orderId=${(res as any)?.data?._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  // ── Empty state ───────────────────────────────────────────────────────────

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-orange-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Add some products to get started
          </p>
        </div>
        <Button
          onClick={() => router.push("/products")}
          className="bg-black hover:bg-slate-800 text-white rounded-xl px-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Cart & Checkout
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {totalItems} items in cart
            </p>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          {/* ── Left: Cart Items + Delivery Form ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                const discountedPrice =
                  item.price > (item.discountPrice || 0)
                    ? Math.round(item.price - (item.discountPrice || 0))
                    : item.price;

                return (
                  <div
                    key={`${item.productId}-${item?.colorId?._id}-${item.size}`}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          Size: {item.size}
                        </span>
                        <span className="text-slate-200">|</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          Color:
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-slate-200"
                            style={{
                              backgroundColor: item?.colorId?.color ?? "#ccc",
                            }}
                          />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-800">
                          ৳{discountedPrice}
                        </span>
                        {item?.discountPrice > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: item.productId,
                              colorId: item.colorId,
                              size: item.size,
                            }),
                          )
                        }
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                colorId: item.colorId,
                                size: item.size,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-slate-700 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                colorId: item.colorId,
                                size: item.size,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-orange-500">
                        ৳{discountedPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
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
                  ] as const
                ).map((f) => (
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

                {/* City Dropdown */}
                <div className="space-y-1 relative">
                  <Label className="text-sm text-slate-600">City</Label>
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
                      className="w-full h-10 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 focus:border-black rounded-xl outline-none text-slate-800"
                    />
                  </div>
                  <input type="hidden" {...register("city")} />
                  {cityDropdownOpen && filteredCities.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onMouseDown={() => handleCitySelect(city)}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                            selectedCity === city
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-slate-700"
                          }`}
                        >
                          {city}
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
                    <p className="text-xs text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {(
                  [
                    {
                      name: "address" as const,
                      label: "Address",
                      placeholder: "House, Road, Area",
                    },
                  ] as const
                ).map((f) => (
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
                {/* <div className="space-y-2">
                  <Label className="text-sm text-slate-600">
                    Payment Method
                  </Label>
                  <button
                    type="button"
                    onClick={() => setValue("paymentMethod", "cash")}
                    className={`w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      selectedPayment === "cash"
                        ? "border-black bg-black text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Cash on Delivery
                  </button>
                  {errors.paymentMethod && (
                    <p className="text-xs text-red-500">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 sticky top-6">
            <h2 className="font-bold text-slate-800 text-base">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>
                  ৳
                  {cartItems
                    .reduce((s, i) => s + i.price * i.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-৳{totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>
                  Delivery Charge
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
              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold text-slate-800 text-base">
                <span>Total</span>
                <span className="text-orange-500">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11  cursor-pointer animate-pulse-glow
    hover:animate-none
    transition-all duration-300 bg-[#FF6900] hover:bg-slate-800 text-white rounded-xl font-semibold text-sm gap-2"
            >
              {isLoading ? "Placing Order..." : "Confirm Order"}
              <ArrowRight className="h-4 w-4" />
              <span className="underline-animation" />
            </Button>

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Shopping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
