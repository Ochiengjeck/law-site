"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

function isMissingMediaTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

export async function deleteMedia(id: number) {
  let record = null;

  try {
    record = await prisma.media.findUnique({ where: { id } });
  } catch (error) {
    if (!isMissingMediaTableError(error)) throw error;
    return;
  }

  if (!record) return;

  await cloudinary.uploader.destroy(record.publicId);

  try {
    await prisma.media.delete({ where: { id } });
  } catch (error) {
    if (!isMissingMediaTableError(error)) throw error;
  }

  revalidatePath("/admin/dashboard/media");
}
