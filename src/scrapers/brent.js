import axios from "axios"

export async function scrapeBrent() {
  try {
    const { data } = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "BRENT",
        interval: "daily",
        apikey: process.env.ALPHAVANTAGE_KEY,
      }
    })

    const latest = data.data[0]
    return {
      price: parseFloat(latest.value),
      updated: latest.date,
    }
  } catch (err) {
    console.error("[BRENT] Błąd:", err.message)
    return null
  }
}