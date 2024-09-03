"use server";

import { getNotionData } from "@/lib/notion";

export async function get() {
  return getNotionData();
}
