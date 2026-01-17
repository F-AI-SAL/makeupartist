import fs from "node:fs/promises";
import path from "node:path";

export type ServiceItem = {
  id?: string;
  title: string;
  description?: string;
  price?: string;
};

const SERVICES_PATH = path.join(process.cwd(), "data", "services.json");

export async function getServicesData(): Promise<ServiceItem[]> {
  const raw = await fs.readFile(SERVICES_PATH, "utf8").catch(() => "[]");
  const data = JSON.parse(raw) as ServiceItem[];
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  return [
    { title: "Bridal Makeup", description: "Signature bridal looks with long-lasting glow." },
    { title: "Party Glam", description: "Soft glam and bold glam packages." },
    { title: "Glass Skin Facial", description: "K-beauty inspired glow facial." },
    { title: "Hair Styling", description: "Blowouts, curls, and updos." }
  ];
}
