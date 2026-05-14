"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
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

// ── Schema ────────────────────────────────────────────────────────────────────

const buyNowSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
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
  selectedColor: string;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BuyNowModal({
  open,
  onOpenChange,
  productId,
  productName,
  price,
  discountPrice,
  selectedSize,
  selectedColor,
  quantity,
}: BuyNowModalProps) {
  const router = useRouter();
  const [createOrder, { isLoading }] = usePostDynamicMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BuyNowForm>({
    resolver: zodResolver(buyNowSchema),
    defaultValues: { paymentMethod: "cash" },
  });

  const selectedPayment = watch("paymentMethod");

  const onSubmit = async (form: BuyNowForm) => {
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
      items: [
        {
          productId,
          quantity,
          price: discountPrice,
          selectedSize: String(selectedSize),
          selectedColor,
        },
      ],
      totalPrice: discountPrice * quantity,
      paymentMethod: form.paymentMethod,
    };

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
      const error = err as { data?: { message?: string } };
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
            Size: {selectedSize} · Color: {selectedColor} · Qty: {quantity}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-slate-800 dark:text-white">
              Tk {(discountPrice * quantity).toLocaleString()}
            </span>
            {price > discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                Tk {(price * quantity).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {formFields.map((f) => (
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
          <div className="space-y-2">
            <Label className="text-sm text-slate-600 dark:text-slate-300">
              Payment Method
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "cash", label: "Cash on Delivery" },
                // { value: "online", label: "Online Payment", disabled: true },
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
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-semibold gap-2 mt-2"
          >
            <Zap className="h-4 w-4" />
            {isLoading ? "Placing Order..." : "Confirm Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
