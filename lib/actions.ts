"use server";
import { signIn } from "@/lib/auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "digest" in e) {
      const digest = (e as { digest: string }).digest;
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    return { error: "Invalid email or password" };
  }
  return { error: "" };
}
