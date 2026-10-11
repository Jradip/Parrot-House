import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminAccountSchema } from "@/lib/validation/admin-account";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = createAdminAccountSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data akun admin belum valid." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.fullName },
    });

    if (error || !data.user) {
      const duplicate = error?.message.toLowerCase().includes("already");
      return NextResponse.json(
        { error: duplicate ? "Email tersebut sudah digunakan." : "Akun admin belum dapat dibuat." },
        { status: duplicate ? 409 : 400 },
      );
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({ full_name: parsed.data.fullName, role: "ADMIN" })
      .eq("id", data.user.id);

    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);
      return NextResponse.json(
        { error: "Role admin belum dapat disimpan. Akun dibatalkan." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: data.user.id, email: data.user.email }, { status: 201 });
  } catch (error) {
    console.error("Create admin account failed", error);
    return NextResponse.json({ error: "Akun admin belum dapat dibuat." }, { status: 500 });
  }
}
