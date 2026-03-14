"use server";

import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function deleteMedia(id: number) {
  const record = await prisma.media.findUnique({ where: { id } });
  if (!record) return;

  await cloudinary.uploader.destroy(record.publicId);
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/dashboard/media");
}
