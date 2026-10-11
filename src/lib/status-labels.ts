const paymentStatusLabels: Record<string, string> = {
  PENDING: "Menunggu pembayaran",
  PAID: "Lunas",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
  REFUNDED: "Dikembalikan",
};

const paymentMethodLabels: Record<string, string> = {
  qris: "QRIS",
  other_qris: "QRIS",
  gopay: "GoPay / QRIS",
  shopeepay: "ShopeePay",
  bank_transfer: "Transfer bank",
  bca_va: "BCA Virtual Account",
  bni_va: "BNI Virtual Account",
  bri_va: "BRI Virtual Account",
  cimb_va: "CIMB Niaga Virtual Account",
  permata_va: "Permata Virtual Account",
  echannel: "Mandiri Bill Payment",
};

const orderStatusLabels: Record<string, string> = {
  WAITING_PAYMENT: "Menunggu pembayaran",
  PAID: "Sudah dibayar",
  PROCESSING: "Sedang diproses dan dikemas",
  READY_TO_SHIP: "Siap dikirim",
  SHIPPED: "Sudah dikirim",
  DELIVERED: "Sudah diterima",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const shippingStatusLabels: Record<string, string> = {
  PENDING: "Menunggu diproses",
  READY: "Siap dikirim",
  READY_TO_SHIP: "Siap dikirim",
  SHIPPED: "Sudah dikirim",
  DELIVERED: "Sudah diterima",
  CANCELLED: "Dibatalkan",
};

const birdStatusLabels: Record<string, string> = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  SOLD: "Terjual",
  UNAVAILABLE: "Tidak tersedia",
};

const roleLabels: Record<string, string> = {
  CUSTOMER: "Pelanggan",
  ADMIN: "Admin",
};

const articleStatusLabels: Record<string, string> = {
  DRAFT: "Draf",
  PUBLISHED: "Terbit",
  ARCHIVED: "Diarsipkan",
};

function fallback(value: string | null | undefined) {
  if (!value) return "Belum tersedia";
  return value.toLowerCase().replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

export function getPaymentStatusLabel(value: string | null | undefined) {
  return value ? paymentStatusLabels[value] ?? fallback(value) : fallback(value);
}

export function getPaymentMethodLabel(value: string | null | undefined) {
  return value ? paymentMethodLabels[value.toLowerCase()] ?? fallback(value) : "Belum dipilih";
}

export function getOrderStatusLabel(value: string | null | undefined) {
  return value ? orderStatusLabels[value] ?? fallback(value) : fallback(value);
}

export function getShippingStatusLabel(value: string | null | undefined) {
  return value ? shippingStatusLabels[value] ?? fallback(value) : fallback(value);
}

export function getBirdStatusLabel(value: string | null | undefined) {
  return value ? birdStatusLabels[value] ?? fallback(value) : fallback(value);
}

export function getRoleLabel(value: string | null | undefined) {
  return value ? roleLabels[value] ?? fallback(value) : fallback(value);
}

export function getArticleStatusLabel(value: string | null | undefined) {
  return value ? articleStatusLabels[value] ?? fallback(value) : fallback(value);
}
