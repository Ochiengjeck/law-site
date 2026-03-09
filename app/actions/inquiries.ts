"use server";

import { prisma } from "@/lib/prisma";

type State = { error: string | null; success: boolean };

export async function submitInquiry(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const serviceType = formData.get("serviceType") as string;
  const message = formData.get("message") as string;

  if (!name?.trim() || !email?.trim() || !serviceType || !message?.trim()) {
    return { error: "Please fill in all required fields.", success: false };
  }

  try {
    await prisma.inquiry.create({
      data: { name, email, phone, serviceType, message },
    });
    return { error: null, success: true };
  } catch {
    return {
      error: "Something went wrong. Please try again.",
      success: false,
    };
  }
}
