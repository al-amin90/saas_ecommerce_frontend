import TrackOrderClient from "./TrackOrderClient";

export default function TrackOrderPage({
  searchParams,
}: {
  searchParams?: { orderId?: string | string[] };
}) {
  const rawOrderId = searchParams?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  return <TrackOrderClient initialOrderId={orderId} />;
}
