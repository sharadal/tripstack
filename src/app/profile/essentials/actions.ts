"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EssentialsActionState = { error?: string; success?: string };

// These mirror the check constraints in supabase/essentials.sql (plus the
// per-item limit, which is only enforced here) so users get a friendly
// message instead of a database error.
const TITLE_MAX = 80;
const ITEM_MAX = 60;
const ITEMS_MAX = 50;

const SESSION_EXPIRED = "Your session has expired — please sign in again.";

function readList(
  formData: FormData,
): { title: string; items: string[] } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const items = formData
    .getAll("items")
    .map((item) => String(item).trim())
    .filter(Boolean);

  if (!title) return { error: "Give your list a name." };
  if (title.length > TITLE_MAX) {
    return { error: `List name must be ${TITLE_MAX} characters or fewer.` };
  }
  if (items.length > ITEMS_MAX) {
    return { error: `A list can have up to ${ITEMS_MAX} items.` };
  }
  if (items.some((item) => item.length > ITEM_MAX)) {
    return { error: `Each item must be ${ITEM_MAX} characters or fewer.` };
  }
  return { title, items };
}

// Server Actions are public endpoints, so each one re-checks the session
// itself. They use the signed-in user's client (not the service-role key),
// so the essentials_lists RLS policies decide what each user can touch.
export async function createEssentialsList(
  _prevState: EssentialsActionState,
  formData: FormData,
): Promise<EssentialsActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: SESSION_EXPIRED };

  const list = readList(formData);
  if ("error" in list) return list;

  // user_id is filled in by the database from the signed-in user.
  const { error } = await supabase.from("essentials_lists").insert(list);
  if (error) return { error: "Couldn't save your list — please try again." };

  revalidatePath("/profile");
  return { success: "List saved." };
}

export async function updateEssentialsList(
  _prevState: EssentialsActionState,
  formData: FormData,
): Promise<EssentialsActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: SESSION_EXPIRED };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing list id." };

  const list = readList(formData);
  if ("error" in list) return list;

  const { data: saved, error } = await supabase
    .from("essentials_lists")
    .update(list)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) return { error: "Couldn't save your list — please try again." };
  if (!saved?.length) {
    return { error: "We couldn't find that list — please refresh the page." };
  }

  revalidatePath("/profile");
  return { success: "List saved." };
}

export async function deleteEssentialsList(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("essentials_lists")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/profile");
}
