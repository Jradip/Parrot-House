import { z } from "zod";

export const checkoutSchema = z.object({
  items: z.array(z.object({ birdId: z.string().uuid(), quantity: z.number().int().positive().max(99) })).min(1),
  shippingZoneId: z.string().uuid("Pilih metode pengiriman yang tersedia."),
  customer: z.object({ fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(9) }),
  address: z.object({ receiverName: z.string().min(2), receiverPhone: z.string().min(9), province: z.string().min(2), city: z.string().min(2), district: z.string().min(2), postalCode: z.string().min(4), address: z.string().min(8) }),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["QRIS", "BANK_TRANSFER", "SHOPEEPAY"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
