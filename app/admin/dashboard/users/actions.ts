"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type State = { error: string | null; success?: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin");
  return session;
}

export async function createUser(
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string)?.trim() || "admin";

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: { name, email, password: hashed, role },
  });

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
}

export async function updateUser(
  id: number,
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = (formData.get("role") as string)?.trim() || "admin";

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  const conflict = await prisma.adminUser.findFirst({
    where: { email, NOT: { id } },
  });
  if (conflict) {
    return { error: "Another user already has this email address." };
  }

  await prisma.adminUser.update({
    where: { id },
    data: { name, email, role },
  });

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
}

export async function changePassword(
  id: number,
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();

  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.adminUser.update({
    where: { id },
    data: { password: hashed },
  });

  return { error: null, success: "Password updated successfully." };
}

export async function deleteUser(id: number) {
  const session = await requireAdmin();

  // Cannot delete yourself
  if (session.userId === id) return;

  // Cannot delete the last remaining user
  const count = await prisma.adminUser.count();
  if (count <= 1) return;

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/dashboard/users");
}
