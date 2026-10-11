import { z } from "zod";

export const createAdminAccountSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama terlalu panjang."),
  email: z.string().trim().email("Masukkan alamat email yang valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(72, "Kata sandi maksimal 72 karakter."),
});

export type CreateAdminAccountInput = z.infer<typeof createAdminAccountSchema>;
