import { useState } from 'react'
import { CheckoutSection } from './components/CheckoutSection'
import { MeritItemsList } from './components/MeritItemsList'
import { SearchSection } from './components/SearchSection'
import type { MeritItem } from './types'
import { isGitHubUser } from './types'

function App() {
  const [items, setItems] = useState<MeritItem[]>([])

  const addItem = (item: MeritItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        const itemId = isGitHubUser(item)
          ? item.user.id.toString()
          : item.repo.id.toString()
        return itemId !== id
      })
    )
  }

  const updateItemAmount = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) => {
        const itemId = isGitHubUser(item)
          ? item.user.id.toString()
          : item.repo.id.toString()
        return itemId === id ? { ...item, amount } : item
      })
    )
  }

  return (
    <div className="mx-auto container p-8 font-sans">
      <h1 className="text-center text-3xl font-bold text-foreground mb-8 flex items-center justify-center gap-3">
        <img src="/logo.svg" alt="Tiny Merit" className="w-10 h-10" />
        Tiny Merit
      </h1>

      <SearchSection
        onAddItem={addItem}
        onRemoveItem={removeItem}
        existingItems={items}
      />

      <MeritItemsList
        items={items}
        onUpdateAmount={updateItemAmount}
        onRemoveItem={removeItem}
      />

      <CheckoutSection items={items} />
    </div>
  )
}

export default App
