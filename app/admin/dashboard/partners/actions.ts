"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type State = { error: string | null };

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin");
}

function parsePartnerForm(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim(),
    role: (formData.get("role") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim() ?? "",
    bio: (formData.get("bio") as string)?.trim(),
    expertise: (formData.get("expertise") as string)?.trim(),
    education: (formData.get("education") as string)?.trim(),
    order: parseInt((formData.get("order") as string) ?? "0", 10) || 0,
  };
}

export async function createPartner(
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();
  const data = parsePartnerForm(formData);

  if (!data.name || !data.role || !data.bio) {
    return { error: "Name, role, and bio are required." };
  }

  await prisma.partner.create({ data });

  revalidatePath("/partners");
  revalidatePath("/");
  redirect("/admin/dashboard/partners");
}

export async function updatePartner(
  id: number,
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();
  const data = parsePartnerForm(formData);

  if (!data.name || !data.role || !data.bio) {
    return { error: "Name, role, and bio are required." };
  }

  await prisma.partner.update({ where: { id }, data });

  revalidatePath("/partners");
  revalidatePath("/");
  redirect("/admin/dashboard/partners");
}

export async function deletePartner(id: number) {
  await requireAdmin();
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/partners");
  revalidatePath("/");
}
