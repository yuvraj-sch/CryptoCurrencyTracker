"use client"

import { useState, useEffect } from "react"
import { fetchTopCryptos } from "../actions/crypto"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Crypto {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

export function CryptoList() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    async function loadCryptos() {
      try {
        const data = await fetchTopCryptos()
        if (data) {
          setCryptos(data)
          setLastUpdated(new Date())
        } else {
          setError("Failed to load cryptocurrencies")
        }
      } catch (err) {
        setError("An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }
    loadCryptos()
  }, [])

  if (loading)
    return (
      <Card className="p-4">
        <div className="text-center">Loading cryptocurrencies...</div>
      </Card>
    )
  if (error)
    return (
      <Card className="p-4">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    )
  if (cryptos.length === 0)
    return (
      <Card className="p-4">
        <div className="text-center">No cryptocurrency data available</div>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Cryptocurrencies</CardTitle>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto, index) => (
              <TableRow key={crypto.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center">
                  <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-6 h-6 mr-2" />
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </TableCell>
                <TableCell>${crypto.current_price.toLocaleString()}</TableCell>
                <TableCell className={crypto.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell>${crypto.market_cap.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

