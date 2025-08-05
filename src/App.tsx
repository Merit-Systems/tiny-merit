import { useState } from 'react'
import { SearchSection } from './components/SearchSection'
import { MeritItemsList } from './components/MeritItemsList'
import { CheckoutSection } from './components/CheckoutSection'
import type { MeritItem } from './types'

function App() {
  const [items, setItems] = useState<MeritItem[]>([])

  const addItem = (item: MeritItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateItemAmount = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item))
    )
  }

  return (
    <div className="mx-auto container p-8 font-sans">
      <h1 className="text-center text-3xl font-bold text-foreground mb-8">
        Tiny Merit
      </h1>

      <SearchSection onAddItem={addItem} onRemoveItem={removeItem} existingItems={items} />

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
