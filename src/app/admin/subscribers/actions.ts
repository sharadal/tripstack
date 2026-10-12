"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isCurrentUserAdmin } from "@/lib/admin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Postgres unique_violation — the email is already subscribed.
const UNIQUE_VIOLATION = "23505";

// `error` is a problem the admin can fix in the form (shown inline);
// `failure` is something that went wrong on our side (shown as a toast).
export type ActionState = { error?: string; failure?: string; success?: string };

// Server Actions are public endpoints, so each one re-checks the admin
// allowlist rather than trusting that the caller came from the protected
// page.
const NOT_ADMIN_ERROR = "You don't have permission to do that.";

function validate(firstName: string, email: string): string | undefined {
  if (!firstName) return "Enter a first name.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

export async function createSubscriber(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isCurrentUserAdmin())) return { failure: NOT_ADMIN_ERROR };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const validationError = validate(firstName, email);
  if (validationError) return { error: validationError };

  const { error } = await supabaseAdmin
    .from("subscribers")
    .insert({ first_name: firstName, email });

  if (error) {
    return error.code === UNIQUE_VIOLATION
      ? { error: "That email is already subscribed." }
      : { failure: "Something went wrong — please try again." };
  }

  revalidatePath("/admin/subscribers");
  return { success: `${email} added.` };
}

export async function updateSubscriber(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isCurrentUserAdmin())) return { failure: NOT_ADMIN_ERROR };

  const id = String(formData.get("id") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!id) return { failure: "Missing subscriber id." };
  const validationError = validate(firstName, email);
  if (validationError) return { error: validationError };

  const { error } = await supabaseAdmin
    .from("subscribers")
    .update({ first_name: firstName, email })
    .eq("id", id);

  if (error) {
    return error.code === UNIQUE_VIOLATION
      ? { error: "That email is already subscribed." }
      : { failure: "Something went wrong — please try again." };
  }

  revalidatePath("/admin/subscribers");
  return { success: "Subscriber updated." };
}

export async function deleteSubscriber(formData: FormData): Promise<ActionState> {
  if (!(await isCurrentUserAdmin())) return { failure: NOT_ADMIN_ERROR };

  const id = String(formData.get("id") ?? "");
  if (!id) return { failure: "Missing subscriber id." };

  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id);
  if (error) return { failure: "Couldn't remove that subscriber — please try again." };

  revalidatePath("/admin/subscribers");
  return { success: "Subscriber removed." };
}
