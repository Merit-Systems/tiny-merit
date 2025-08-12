import { useState } from 'react'
import type { MeritItem } from '../types'
import { isGitHubUser } from '../types'
import { CheckoutSection } from './CheckoutSection'
import { MeritItemsList } from './MeritItemsList'
import { SearchSection } from './SearchSection'

export function PayLinksTab() {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Create Payment Links</h2>
        <p className="text-gray-600 text-sm">
          Search for GitHub users and repositories to create Merit payment
          links.
        </p>
      </div>

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
