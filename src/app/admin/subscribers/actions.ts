"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Postgres unique_violation — the email is already subscribed.
const UNIQUE_VIOLATION = "23505";

export type ActionState = { error?: string };

// Server Actions are public endpoints, so each one re-checks the session
// rather than trusting that the caller came from the protected page.
const SIGNED_OUT_ERROR = "Your session has ended — sign in again.";

function validate(firstName: string, email: string): string | undefined {
  if (!firstName) return "Enter a first name.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

export async function createSubscriber(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getCurrentUser())) return { error: SIGNED_OUT_ERROR };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const validationError = validate(firstName, email);
  if (validationError) return { error: validationError };

  const { error } = await supabaseAdmin
    .from("subscribers")
    .insert({ first_name: firstName, email });

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "That email is already subscribed."
          : "Something went wrong — please try again.",
    };
  }

  revalidatePath("/admin/subscribers");
  return {};
}

export async function updateSubscriber(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getCurrentUser())) return { error: SIGNED_OUT_ERROR };

  const id = String(formData.get("id") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!id) return { error: "Missing subscriber id." };
  const validationError = validate(firstName, email);
  if (validationError) return { error: validationError };

  const { error } = await supabaseAdmin
    .from("subscribers")
    .update({ first_name: firstName, email })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "That email is already subscribed."
          : "Something went wrong — please try again.",
    };
  }

  revalidatePath("/admin/subscribers");
  return {};
}

export async function deleteSubscriber(formData: FormData) {
  if (!(await getCurrentUser())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabaseAdmin.from("subscribers").delete().eq("id", id);
  revalidatePath("/admin/subscribers");
}
