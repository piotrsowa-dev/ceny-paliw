import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://www.gov.pl";
const NEWS_URL = `${BASE}/web/energia/wiadomosci`;

export async function scrapeGov() {
  try {
    // Pobieramy listę newsów
    const { data: html } = await axios.get(NEWS_URL, { timeout: 15000 });
    const $ = cheerio.load(html);

    const now = new Date()
    const day = now.getDay()
    const isWeekend = day === 0 || day === 6
    const isAfterPublish = now.getHours() > 12 || (now.getHours() === 12 && now.getMinutes() >= 30)
    const targetIndex = (isWeekend || !isAfterPublish) ? 1 : 2
    // Szukamy najnowszego artykułu o maksymalnej cenie
    let articleUrl = null;
    let count = 0

    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().toLowerCase();
      if (
        !articleUrl &&
        (text.includes("maksymalna cena") || text.includes("cena detaliczna")) &&
        href.includes("/web/energia/")
      ) {
        count++
        if (count === targetIndex) {
             articleUrl = href.startsWith("http") ? href : BASE + href;
             return false
        }
      }
    });

    if (!articleUrl) throw new Error("Nie znaleziono artykułu z cenami");

    console.log("[GOV] Artykuł:", articleUrl);

    // Pobieramy artykuł
    const { data: article } = await axios.get(articleUrl, { timeout: 15000 });
    const $a = cheerio.load(article);
    const text = $a("body").text();

    // Wyciągamy ceny regexem
    const pb95 = extractPrice(text, ["benzyna 95", "pb95", "eurosuper 95"]);
    const pb98 = extractPrice(text, ["benzyna 98", "pb98", "super plus 98"]);
    const on = extractPrice(text, ["olej napędowy", "diesel", "on -"]);

    const prices = { pb95, pb98, on };
    console.log("[GOV] Pobrano ceny:", prices);
    console.log(now.getHours(), now.getMinutes());


    return { ...prices, updated: new Date().toISOString() };
  } catch (err) {
    console.error("[GOV] Błąd scrapingu:", err.message);
    return null;
  }
}

function extractPrice(text, keywords) {
  const lower = text.toLowerCase();

  for (const keyword of keywords) {
    const idx = lower.indexOf(keyword);
    if (idx === -1) continue;

    // Szukamy liczby w formacie X,XX zł/l w okolicy słowa kluczowego
    const chunk = text.slice(idx, idx + 60);
    const match = chunk.match(/(\d+)[,.](\d{2})\s*z[łl]/i);
    if (match) {
      return parseFloat(`${match[1]}.${match[2]}`);
    }
  }
  return null;
}
