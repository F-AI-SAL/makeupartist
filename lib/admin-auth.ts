import { cookies } from "next/headers";

export function isAdminAuthenticated() {
  return cookies().get("admin")?.value === "1";
}

export function assertAdminAuth() {
  if (!isAdminAuthenticated()) {
    return false;
  }
  return true;
}
