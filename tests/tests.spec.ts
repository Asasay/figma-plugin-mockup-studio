import { test, expect } from "@playwright/test";

test("mocked purchase successful", async ({ page }) => {
  await page.route("https://api.gumroad.com/v2/licenses/verify", async (route) => {
    const json = { success: true };
    await route.fulfill({ json });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Buy" }).click();
  await page.getByLabel("License Key").fill("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("combobox", { name: "Mockup tags search box" })).toBeVisible();
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes("/assets/") && response.request().method() === "GET"
  );
  await page.locator(".ant-col > a").first().click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
});

test("mocked purchase fails", async ({ page }) => {
  await page.route("https://api.gumroad.com/v2/licenses/verify", async (route) => {
    const json = { success: false };
    await route.fulfill({ json });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Buy" }).click();
  await page.getByLabel("License Key").fill("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("combobox", { name: "Mockup tags search box" })).toBeVisible();
  await page.locator(".ant-col > a").first().click();
  await expect(page.getByText("You have run out of free")).toBeVisible();
});
