import OrderSuccessClient from "@/src/components/home/OrderSuccessClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
