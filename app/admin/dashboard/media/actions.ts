"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export async function deleteMedia(url: string) {
  const relativePath = url.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relativePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  revalidatePath("/admin/dashboard/media");
}
