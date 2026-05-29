import cron from "node-cron";
import { scrapeOrlen } from "./scrapers/orlen.js";
import { scrapeGov } from "./scrapers/gov.js";
import { scrapeBrent} from "./scrapers/brent.js";
import { read, write } from "./storage.js";

export function startCrons() {
  // ORLEN — codziennie o 00:30
  cron.schedule("30 0 * * *", async () => {
    console.log("[CRON] Start scrapingu ORLEN...");
    const hurt = await scrapeOrlen();
    if (hurt) {
      const current = read();
      write({ ...current, hurt });
    }
  });

  // GOV — codziennie o 12:30
  cron.schedule("*/30 * * * *", async () => {
    console.log("[CRON] Start scrapingu GOV...");
    const detal = await scrapeGov();
    if (detal) {
      const current = read();
      write({ ...current, detal });
    }
  });

  // BRENT - co 30 min
    cron.schedule("*/30 * * * *", async () => {
    console.log("[CRON] Start scrapingu BRENT...");
    const brent = await scrapeBrent();
    if (brent) {
      const current = read();
      write({ ...current, brent });
    }
  });

  console.log("[CRON] Harmonogram uruchomiony.");
}

// Ręczne wywołanie przy starcie serwera (opcjonalne, do testów)
export async function runNow() {
  console.log("[INIT] Pierwsze pobieranie danych...");
  const [hurt, detal, brent] = await Promise.all([scrapeOrlen(), scrapeGov(), scrapeBrent()]);
  const current = read();
  write({
    hurt: hurt ?? current.hurt,
    detal: detal ?? current.detal,
    brent: brent ?? current.brent,
  });
}