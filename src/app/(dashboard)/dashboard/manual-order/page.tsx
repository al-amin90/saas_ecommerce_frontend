"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Search, Plus, Minus, Trash2, User, Users } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import { useCreateOrderMutation } from "@/src/redux/features/order/orderApi";
import {
  BD_CITIES,
  DHAKA_CHARGE,
  OUTSIDE_DHAKA_CHARGE,
} from "@/src/utils/delivaryCharge";
import { ICartItem } from "@/src/redux/features/cart/cartSlice";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IStock {
  size: number;
  quantity: number;
  _id: string;
}

interface IVariant {
  _id: string;
  color: { _id: string; name: string; color: string };
  stock: IStock[];
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  sku: string;
  images: string[];
  variant: IVariant[];
  categoryID: { name: string };
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const customerSchema = z.object({
  customerType: z.string().optional(),
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  paymentMethod: z.enum(["cash", "card"]),
});

type CustomerForm = z.infer<typeof customerSchema>;

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAddToOrder,
}: {
  product: IProduct;
  onAddToOrder: (item: ICartItem) => void;
}) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const activeVariant = product.variant?.[selectedVariantIdx];
  const stockList = activeVariant?.stock ?? [];

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    const stock = stockList.find((s) => String(s.size) === selectedSize);
    if (!stock || stock.quantity === 0) {
      toast.error("Out of stock");
      return;
    }

    const calciulatedPrice =
      product.price > (product.discountPrice || 0)
        ? Math.round(product.price - (product.discountPrice || 0))
        : product.price;

    onAddToOrder({
      productId: product._id,
      productName: product.name,
      productImage: product.images?.[0] ?? "",
      colorId: activeVariant.color._id,
      colorName: activeVariant.color.name,
      colorHex: activeVariant.color.color,
      selectedSize,
      quantity: 1,
      originalPrice: calciulatedPrice,
      price: calciulatedPrice,
      stock: stock.quantity,
    });

    toast.success(`${product.name} added`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-3">
      {/* Image + Name */}
      <div className="flex gap-3 items-start">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
            {product.name}
          </p>
          <p className="text-xs text-slate-400 font-mono">{product.sku}</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              ৳
              {product.price > (product.discountPrice || 0)
                ? Math.round(product.price - (product.discountPrice || 0))
                : product.price}
            </span>
            {product?.discountPrice > 0 && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Color selector */}
      {product.variant?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {product.variant.map((v, i) => (
            <button
              key={v._id}
              onClick={() => {
                setSelectedVariantIdx(i);
                setSelectedSize("");
              }}
              type="button"
              title={v.color.name}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                selectedVariantIdx === i
                  ? "border-black scale-110"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              style={{ backgroundColor: v.color.color }}
            />
          ))}
        </div>
      )}

      {/* Size selector */}
      {stockList.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {stockList.map((s) => (
            <button
              key={s._id}
              onClick={() => setSelectedSize(String(s.size))}
              type="button"
              disabled={s.quantity === 0}
              className={`w-9 h-8 rounded-lg text-xs font-medium border transition-all ${
                selectedSize === String(s.size)
                  ? "bg-black text-white border-black"
                  : s.quantity === 0
                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                    : "bg-white text-slate-700 border-slate-200 hover:border-black dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>
      )}

      <Button
        onClick={handleAdd}
        type="button"
        disabled={!selectedSize}
        className="w-full h-8 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold gap-1"
      >
        <Plus className="h-3 w-3" />
        Add to Order
      </Button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ManualOrderPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [customerType, setCustomerType] = useState<"guest" | "existing">(
    "guest",
  );
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  //   delivary charge
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(OUTSIDE_DHAKA_CHARGE);
  const [deliveryChargeEdited, setDeliveryChargeEdited] = useState(false);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // ── Fetch products ────────────────────────────────────────────────────────

  const { data: productData, isLoading: productsLoading } = useGetDynamicQuery({
    url: "/product",
    params: { limit: 100 },
  });

  const { data: userData } = useGetDynamicQuery(
    { url: "/user", params: { search: userSearch, limit: 10 } },
    { skip: customerType !== "existing" || userSearch.length < 2 },
  );

  const products: IProduct[] = productData?.data ?? [];
  const users: IUser[] = userData?.data ?? [];

  // ── Filter products ───────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  // ── Cart handlers ─────────────────────────────────────────────────────────

  const handleAddToOrder = (item: ICartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.colorId === item.colorId &&
          i.selectedSize === item.selectedSize,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId &&
          i.colorId === item.colorId &&
          i.selectedSize === item.selectedSize
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const handleQuantityChange = (idx: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, item.quantity + delta),
                item.stock,
              ),
            }
          : item,
      ),
    );
  };

  const handlePriceChange = (idx: number, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;
    setCartItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, price: parsed } : item)),
    );
  };

  const handleRemove = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // ── Delivary charge ──────────────────────────────────────────────────────────────────

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setCityDropdownOpen(false);

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

  // ── Form ──────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: "guest",
      paymentMethod: "cash",
    },
  });

  const selectedPayment = watch("paymentMethod");

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (form: CustomerForm) => {
    if (cartItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    console.log("hit");

    const payload = {
      guestCheckout: customerType === "guest",
      // guestEmail: form.email,
      guestInfo: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        // city: form.city,
      },

      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        colorId: item.colorId,
      })),
      totalPrice: grandTotal,
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await createOrder(payload).unwrap();
      toast.success("Order created successfully!");
      router.push(`/dashboard/order`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Create Manual Order
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select products and fill customer info
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-sm border-slate-200"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* ── Left: Product Selection ── */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                Select Products
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or SKU..."
                  className="pl-9 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                />
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {productsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-40 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                      />
                    ))
                  : filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToOrder={handleAddToOrder}
                      />
                    ))}
                {!productsLoading && filteredProducts.length === 0 && (
                  <p className="col-span-2 text-center text-sm text-slate-400 py-8">
                    No products found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary + Customer ── */}
          <div className="space-y-4">
            {/* Order items */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                Order Items ({cartItems.length})
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No items added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                    >
                      {/* Image */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-xs text-slate-400">
                            {item.colorName} · Size {item.selectedSize}
                          </span>
                        </div>

                        {/* Price edit */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Price:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-500">৳</span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handlePriceChange(idx, e.target.value)
                              }
                              className="w-20 h-6 text-xs border border-slate-200 dark:border-slate-600 rounded-md px-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-black"
                            />
                          </div>
                          {item.price !== item.originalPrice && (
                            <Badge className="text-xs bg-orange-100 text-orange-600 hover:bg-orange-100 px-1.5 py-0">
                              edited
                            </Badge>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Qty:</span>
                          <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, -1)}
                              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-slate-800 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, 1)}
                              disabled={item.quantity >= item.stock}
                              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white ml-auto">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="text-slate-300 hover:text-red-500 transition-colors mt-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Subtotal</span>
                      <span>৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>
                        Delivery
                        {/* {selectedCity && (
                          <span className="ml-1 text-xs">
                            (
                            {selectedCity.toLowerCase() === "dhaka"
                              ? "Inside"
                              : "Outside"}{" "}
                            Dhaka)
                          </span>
                        )} */}
                      </span>
                      <span
                        className={
                          deliveryChargeEdited ? "text-orange-500" : ""
                        }
                      >
                        ৳ {deliveryCharge || "-"}
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
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Customer Info
              </h2>

              {/* Form fields */}
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
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    {f.label}
                  </Label>
                  <Input
                    {...register(f.name)}
                    placeholder={f.placeholder}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-black rounded-lg text-sm"
                  />
                  {errors[f.name] && (
                    <p className="text-xs text-red-500">
                      {errors[f.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* City — Search Dropdown */}
              {/* <div className="space-y-1 relative">
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
              </div> */}

              {/* Delivery Charge */}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Delivery Charge
                  </Label>
                  {/* {selectedCity && (
                    <span className="text-xs text-slate-400">
                      {selectedCity.toLowerCase() === "dhaka"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}
                    </span>
                  )} */}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={deliveryCharge}
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
                </div>
              </div>

              {[
                {
                  name: "address" as const,
                  label: "Address",
                  placeholder: "House, Road, Area",
                },
              ].map((f) => (
                <div key={f.name} className="space-y-1">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    {f.label}
                  </Label>
                  <Input
                    {...register(f.name)}
                    placeholder={f.placeholder}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-black rounded-lg text-sm"
                  />
                  {errors[f.name] && (
                    <p className="text-xs text-red-500">
                      {errors[f.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* Payment method */}
              {/* <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  Payment Method
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "cash", label: "Cash" },
                    // { value: "card", label: "Card" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setValue("paymentMethod", opt.value as "cash" | "card")
                      }
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedPayment === opt.value
                          ? "border-black bg-black text-white"
                          : "border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || cartItems.length === 0}
                className="w-full h-11 bg-[#FF6900] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold"
              >
                {isLoading
                  ? "Creating Order..."
                  : `Confirm Order · ৳${grandTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
