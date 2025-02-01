"use server"

import OpenAI from "openai"
import { revalidatePath } from "next/cache"

let openai: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error)
  }
} else {
  console.warn("OPENAI_API_KEY is not set. Using mock news data.")
}

const mockCryptoData = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 50000,
    market_cap: 1000000000000,
    price_change_percentage_24h: 5,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3000,
    market_cap: 500000000000,
    price_change_percentage_24h: 3,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 2,
    market_cap: 100000000000,
    price_change_percentage_24h: -1,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.5,
    market_cap: 50000000000,
    price_change_percentage_24h: 10,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 30,
    market_cap: 30000000000,
    price_change_percentage_24h: 2,
  },
]

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return await response.json()
      }
      if (response.status === 429) {
        // Rate limited, wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error("Max retries reached")
}

export async function fetchTopCryptos() {
  try {
    const data = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      { next: { revalidate: 86400 } }, // Revalidate every 24 hours (86400 seconds)
    )
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    console.warn("Using mock crypto data")
    return mockCryptoData
  }
}

function generateMockNews() {
  const headlines = [
    "Bitcoin Surges Past $50,000 Mark",
    "Ethereum 2.0 Upgrade Nears Completion",
    "New Cryptocurrency Regulation Proposed in EU",
    "Major Bank Announces Crypto Custody Service",
    "NFT Market Continues to Grow Despite Challenges",
  ]
  return headlines
}

export async function fetchCryptoNews() {
  if (!openai) {
    console.warn("OpenAI client is not initialized. Using mock news data.")
    return generateMockNews()
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides the latest cryptocurrency news. Provide 5 short news headlines related to cryptocurrencies.",
        },
        {
          role: "user",
          content: "Give me the latest cryptocurrency news headlines.",
        },
      ],
    })

    const newsText = completion.choices[0].message.content
    return newsText.split("\n").filter((line) => line.trim() !== "")
  } catch (error) {
    console.error("Error fetching crypto news:", error)
    return generateMockNews()
  }
}

export async function updateData() {
  revalidatePath("/")
  return { success: true }
}

