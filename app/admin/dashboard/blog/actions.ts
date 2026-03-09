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

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createPost(
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const author = (formData.get("author") as string)?.trim();
  const published = formData.get("published") === "true";
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!title || !content || !author) {
    return { error: "Title, content, and author are required." };
  }

  const slug = toSlug(title);

  try {
    await prisma.blogPost.create({
      data: { title, slug, content, excerpt, imageUrl, author, published },
    });
  } catch {
    return { error: "A post with a similar title already exists." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog");
  redirect("/admin/dashboard/blog");
}

export async function updatePost(
  id: number,
  _prevState: State,
  formData: FormData
): Promise<State> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const author = (formData.get("author") as string)?.trim();
  const published = formData.get("published") === "true";
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!title || !content || !author) {
    return { error: "Title, content, and author are required." };
  }

  await prisma.blogPost.update({
    where: { id },
    data: { title, content, excerpt, imageUrl, author, published },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog");
  redirect("/admin/dashboard/blog");
}

export async function deletePost(id: number) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog");
}

export async function updateInquiryStatus(id: number, status: string) {
  await requireAdmin();
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/dashboard/inquiries");
}
