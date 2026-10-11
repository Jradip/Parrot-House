import { AdminHeading } from "@/components/admin/admin-heading";
import { DataTable } from "@/components/admin/data-table";
import { ShipmentList, type ShipmentListItem } from "@/components/admin/shipment-list";
import { ShippingForm } from "@/components/admin/shipping-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatRupiah } from "@/lib/utils";

type Snapshot = Record<string, unknown>;
type OrderItem = { bird_name_snapshot: string; category_snapshot: string; quantity: number };
type Shipment = { method: string | null; tracking_number: string | null; notes: string | null };
type ShippingOrder = {
  id: string;
  order_number: string;
  payment_status: string;
  order_status: string;
  shipping_status: string;
  address_snapshot: Snapshot;
  customer_snapshot: Snapshot;
  order_items: OrderItem[] | null;
  shipments: Shipment | Shipment[] | null;
};

export default async function AdminShippingPage() {
  const admin = createAdminClient();
  const [{ data: zones }, { data: orderData }] = await Promise.all([
    admin.from("shipping_zones").select("id,name,province,city,shipping_method,price,active").order("province"),
    admin
      .from("orders")
      .select("id,order_number,payment_status,order_status,shipping_status,address_snapshot,customer_snapshot,order_items(bird_name_snapshot,category_snapshot,quantity),shipments(method,tracking_number,notes)")
      .in("order_status", ["PAID", "PROCESSING", "READY_TO_SHIP", "SHIPPED", "DELIVERED"])
      .order("created_at", { ascending: false }),
  ]);

  const orders = ((orderData ?? []) as unknown as ShippingOrder[]).map(toShipmentListItem);

  return (
    <>
      <AdminHeading title="Pengiriman" description="Lihat tujuan pengiriman dan tandai pesanan yang sudah dikirim." />

      <section className="rounded-[var(--radius-md)] bg-off-white p-6">
        <p className="section-kicker">Pesanan pelanggan</p>
        <h2 className="mt-2 font-serif text-3xl">Daftar pengiriman</h2>
        <p className="mt-3 text-sm leading-6 text-muted-text">Daftar ini menampilkan pelanggan, burung, alamat tujuan, dan status pengirimannya.</p>
        <div className="mt-7"><ShipmentList orders={orders} /></div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <p className="section-kicker">Biaya pengiriman</p>
          <h2 className="mt-2 font-serif text-3xl">Alamat dan metode yang tersedia</h2>
        </div>
        <ShippingForm />
        <DataTable headers={["Alamat", "Wilayah", "Metode", "Biaya", "Status"]}>
          {zones?.map((zone) => (
            <tr key={zone.id} className="border-t border-line">
              <td className="p-4 font-bold">{zone.name}</td>
              <td>{zone.city ? `${zone.city}, ` : ""}{zone.province}</td>
              <td>{zone.shipping_method}</td>
              <td>{formatRupiah(Number(zone.price))}</td>
              <td>{zone.active ? "Aktif" : "Nonaktif"}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </>
  );
}

function toShipmentListItem(order: ShippingOrder): ShipmentListItem {
  const customer = order.customer_snapshot ?? {};
  const address = order.address_snapshot ?? {};
  const shipment = Array.isArray(order.shipments) ? order.shipments[0] : order.shipments;
  const birds = order.order_items?.map((item) => `${item.bird_name_snapshot} (${item.category_snapshot}) × ${item.quantity}`) ?? [];

  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: readText(customer, "fullName") || "Nama belum tersedia",
    customerPhone: readText(customer, "phone") || "Nomor WhatsApp belum tersedia",
    birds: birds.length ? birds : ["Informasi burung belum tersedia"],
    address: [
      readText(address, "address"),
      readText(address, "district"),
      readText(address, "city"),
      readText(address, "province"),
      readText(address, "postalCode"),
    ].filter(Boolean).join(", ") || "Alamat belum tersedia",
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    shippingStatus: order.shipping_status,
    method: shipment?.method || "Pengiriman khusus burung",
    trackingNumber: shipment?.tracking_number || "",
    notes: shipment?.notes || "",
  };
}

function readText(snapshot: Snapshot, key: string) {
  const value = snapshot[key];
  return typeof value === "string" ? value : "";
}
