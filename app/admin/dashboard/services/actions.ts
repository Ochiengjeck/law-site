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

function parseServiceForm(formData: FormData) {
  return {
    title: (formData.get("title") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim() ?? "",
    badge: (formData.get("badge") as string)?.trim() ?? "",
    description: (formData.get("description") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim() ?? "",
    items: (formData.get("items") as string)?.trim() ?? "",
    category: (formData.get("category") as string) ?? "main",
    order: parseInt((formData.get("order") as string) ?? "0", 10) || 0,
  };
}

export async function createService(
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();
  const data = parseServiceForm(formData);

  if (!data.title || !data.description) {
    return { error: "Title and description are required." };
  }

  await prisma.service.create({ data });

  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/dashboard/services");
}

export async function updateService(
  id: number,
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();
  const data = parseServiceForm(formData);

  if (!data.title || !data.description) {
    return { error: "Title and description are required." };
  }

  await prisma.service.update({ where: { id }, data });

  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/dashboard/services");
}

export async function deleteService(id: number) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
  revalidatePath("/");
}
