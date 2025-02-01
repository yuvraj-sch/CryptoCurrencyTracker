"use client"

import { useState, useEffect } from "react"
import { fetchCryptoNews } from "../actions/crypto"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NewsSection() {
  const [news, setNews] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchCryptoNews()
        setNews(data)
        setLastUpdated(new Date())
      } catch (err) {
        setError("Failed to load news")
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  if (loading)
    return (
      <Card className="p-4">
        <div className="text-center">Loading news...</div>
      </Card>
    )
  if (error)
    return (
      <Card className="p-4">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    )
  if (news.length === 0)
    return (
      <Card className="p-4">
        <div className="text-center">No news available</div>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency News</CardTitle>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</div>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {news.map((item, index) => (
            <li key={index} className="bg-secondary p-2 rounded">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

