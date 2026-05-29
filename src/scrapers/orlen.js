import { chromium } from "playwright";

export async function scrapeOrlen() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.orlen.pl/pl/dla-biznesu/hurtowe-ceny-paliw", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Czekamy aż tabela z cenami się załaduje
    await page.waitForSelector("table", { timeout: 15000 });

    const prices = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tr");
      const result = {};

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 2) return;

        const name = cells[0].innerText.trim().toLowerCase();
        const price = parseFloat(
          cells[cells.length - 1].innerText
            .trim()
            .replace(",", ".")
            .replace(/[^\d.]/g, "")
        );

        if (isNaN(price)) return;

        if (name.includes("eurosuper 95") || name.includes("pb95"))
          result.pb95 = price / 1000;
        else if (name.includes("super plus") || name.includes("pb98"))
          result.pb98 = price / 1000;
        else if (name.includes("ekodiesel") || name.includes("on"))
          result.on = price / 1000;
        else if (name.includes("lpg")) result.lpg = price;
      });

      return result;
    });

    console.log("[ORLEN] Pobrano ceny:", prices);
    return { ...prices, updated: new Date().toISOString() };
  } catch (err) {
    console.error("[ORLEN] Błąd scrapingu:", err.message);
    return null;
  } finally {
    await browser.close();
  }
}