import { useState } from 'react'
import { SearchSection } from './components/SearchSection'
import { MeritItemsList } from './components/MeritItemsList'
import { CheckoutSection } from './components/CheckoutSection'
import type { MeritItem } from './types'
import { isGitHubUser } from './types'

function App() {
  const [items, setItems] = useState<MeritItem[]>([])

  console.log('App items:', items)

  const addItem = (item: MeritItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => {
      const itemId = isGitHubUser(item) ? item.user.id.toString() : item.repo.id.toString()
      return itemId !== id
    }))
  }

  const updateItemAmount = (id: string, amount: number) => {
    console.log('App updateItemAmount called:', id, amount)
    setItems((prev) =>
      prev.map((item) => {
        const itemId = isGitHubUser(item) ? item.user.id.toString() : item.repo.id.toString()
        return itemId === id ? { ...item, amount } : item
      })
    )
  }

  return (
    <div className="mx-auto container p-8 font-sans">
      <h1 className="text-center text-3xl font-bold text-foreground mb-8">
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
