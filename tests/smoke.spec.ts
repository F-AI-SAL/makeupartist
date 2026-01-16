import { test, expect } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "মিরপুর-২ এর প্রিমিয়াম বিউটি পার্লার" })).toBeVisible();
});

test("services page loads", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { name: "ক্লাসিক + ট্রেন্ডিং সার্ভিস" })).toBeVisible();
});

test("booking form renders and can submit", async ({ page }) => {
  await page.goto("/book");
  await page.fill("input#name", "Ayesha Rahman");
  await page.fill("input#phone", "01929041115");
  await page.selectOption("select#service", { label: "ব্রাইডাল মেকআপ" });
  await page.fill("input#date", "2026-02-01");
  await page.fill("input#time", "16:00");
  await page.fill("textarea#message", "Bridal appointment for evening.");
  await page.getByRole("button", { name: "বুকিং পাঠান" }).click();
  await expect(page.getByText("আপনার বুকিং রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!"))
    .toBeVisible();
});

test("blog list and first post load", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.locator("article").first();
  await expect(firstPost).toBeVisible();
  await firstPost.getByRole("link", { name: "আরও পড়ুন" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});