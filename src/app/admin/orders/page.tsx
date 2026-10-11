import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-heading";
import { OrderAutoRefresh } from "@/components/admin/order-auto-refresh";
import { DataTable } from "@/components/admin/data-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";
export default async function AdminOrdersPage(){const {data}=await createAdminClient().from("orders").select("id,order_number,total,payment_status,order_status,created_at").order("created_at",{ascending:false});return <><OrderAutoRefresh/><AdminHeading title="Pesanan" description="Status pembayaran dan pemrosesan pesanan disimpan secara terpisah."/><DataTable headers={["Pesanan","Tanggal","Total","Pembayaran","Pemrosesan","Aksi"]}>{data?.map((order)=><tr key={order.id} className="border-t border-line"><td className="p-4 font-bold">{order.order_number}</td><td>{new Intl.DateTimeFormat("id-ID").format(new Date(order.created_at))}</td><td>{formatRupiah(Number(order.total))}</td><td>{getPaymentStatusLabel(order.payment_status)}</td><td>{getOrderStatusLabel(order.order_status)}</td><td><Link className="font-bold text-deep-forest" href={`/admin/orders/${order.id}`}>Detail</Link></td></tr>)}</DataTable></>}
