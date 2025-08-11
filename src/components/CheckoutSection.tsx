import { ExternalLink } from 'lucide-react'
import logoSvg from '../assets/logo.svg'
import { useMeritCheckout } from '../lib/merit-provider'
import type { MeritItem } from '../types'
import { isGitHubRepo, isGitHubUser } from '../types'
import { Button } from './ui/button'

interface CheckoutSectionProps {
  items: MeritItem[]
}

export function CheckoutSection({ items }: CheckoutSectionProps) {
  const { generateCheckoutUrl } = useMeritCheckout()

  if (items.length === 0) {
    return null
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const handleCheckout = () => {
    try {
      // Transform items into the format expected by the Merit SDK
      const checkoutItems = items.map((item) => {
        const amount = item.amount

        if (isGitHubUser(item)) {
          return {
            type: 'user' as const,
            id: item.user.id,
            amount: amount,
          }
        } else if (isGitHubRepo(item)) {
          return {
            type: 'repo' as const,
            id: item.repo.id,
            amount: amount,
          }
        }
        throw new Error('Unknown item type')
      })

      // Use the SDK to generate a checkout URL
      console.log('About to generate URL with items:', checkoutItems)
      const checkoutUrl = generateCheckoutUrl({
        items: checkoutItems,
      })

      console.log('Generated checkout URL:', checkoutUrl)
      window.open(checkoutUrl, '_blank')
    } catch (error) {
      console.error('Failed to create checkout URL:', error)
      alert(`Failed to create checkout URL: ${error}`)
    }
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        {items.length} receivers for $
        {totalAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <Button
        className="flex items-center gap-2 border-foreground"
        variant="outline"
        disabled={items.length === 0 || totalAmount === 0}
        onClick={handleCheckout}
      >
        <img src={logoSvg} alt="Merit" className="h-4 w-4" />
        Checkout with Merit
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  )
}
