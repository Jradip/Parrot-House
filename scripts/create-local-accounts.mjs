import { createClient } from "@supabase/supabase-js";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LOCAL_ADMIN_EMAIL",
  "LOCAL_ADMIN_PASSWORD",
  "LOCAL_CUSTOMER_EMAIL",
  "LOCAL_CUSTOMER_PASSWORD",
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`Environment ${key} belum diisi.`);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function ensureUser({ email, password, fullName, role }) {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  let user = usersData.users.find((candidate) => candidate.email === email);

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error || !data.user) throw error ?? new Error("User gagal dibuat.");
    user = data.user;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, email, role })
    .eq("id", user.id);
  if (profileError) throw profileError;
}

await ensureUser({
  email: process.env.LOCAL_ADMIN_EMAIL,
  password: process.env.LOCAL_ADMIN_PASSWORD,
  fullName: "Admin Parrot House",
  role: "ADMIN",
});

await ensureUser({
  email: process.env.LOCAL_CUSTOMER_EMAIL,
  password: process.env.LOCAL_CUSTOMER_PASSWORD,
  fullName: "Customer Demo",
  role: "CUSTOMER",
});

console.log("Akun admin dan customer lokal siap digunakan.");
