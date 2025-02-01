import { CryptoList } from "./components/CryptoList"
import { NewsSection } from "./components/NewsSection"
import { UpdateButton } from "./components/UpdateButton"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">CryptoCurrency Tracker</h1>
      <div className="space-y-8">
        <CryptoList />
        <NewsSection />
        <UpdateButton />
      </div>
    </div>
  )
}

