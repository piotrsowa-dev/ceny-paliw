import { useEffect, useState } from "react"

type FuelPrices = {
  pb95: number | null
  pb98: number | null
  on:   number | null
  lpg?: number | null
  updated: string | null
}
type Brent = {
    price: number | null
    updated: string | null
}

export type PricesData = {
  hurt:  FuelPrices
  detal: FuelPrices
  brent: Brent
}
export function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })
}

export function useCeny() {
  const [data, setData]       = useState<PricesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    fetch("http://localhost:3001/api/ceny")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  

  return { data, loading, error }
}