import { Button } from './ui/button'
import type { MeritItem } from '../types'

interface CheckoutSectionProps {
  items: MeritItem[]
}

export function CheckoutSection({ items }: CheckoutSectionProps) {
  if (items.length === 0) {
    return null
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="mt-8 p-6 border border-border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-foreground font-semibold">
            Total Items: {items.length}
          </p>
          <p className="text-foreground font-bold text-lg">
            Total Amount: ${totalAmount.toFixed(2)}
          </p>
        </div>
        <Button size="lg" className="font-semibold">
          Checkout with Merit
        </Button>
      </div>
    </div>
  )
}