"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin");
}

// Keys that should NOT be stored (form metadata)
const SKIP_KEYS = new Set(["_tab"]);

export async function updateSettings(formData: FormData): Promise<void> {
  await requireAdmin();

  const tab = (formData.get("_tab") as string) ?? "home";

  for (const [key, value] of formData.entries()) {
    if (SKIP_KEYS.has(key)) continue;
    if (typeof value !== "string") continue;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/partners");
  revalidatePath("/blog");
  revalidatePath("/contact");

  redirect(`/admin/dashboard/settings?tab=${tab}&saved=1`);
}
