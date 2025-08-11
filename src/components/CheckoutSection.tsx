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
  const { generateCheckoutUrl: generateSDKCheckoutUrl } = useMeritCheckout()

  if (items.length === 0) {
    return null
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const generateCheckoutUrlWithSDK = (items: MeritItem[]) => {
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
    return generateSDKCheckoutUrl({
      items: checkoutItems,
    })
  }

  const handleCheckout = () => {
    try {
      const checkoutUrl = generateCheckoutUrlWithSDK(items)
      window.open(checkoutUrl, '_blank')
    } catch (error) {
      console.error('Failed to create checkout URL:', error)
      // Fallback to manual URL generation
      window.open(generateManualCheckoutUrl(items), '_blank')
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

const generateManualCheckoutUrl = (items: MeritItem[]) => {
  const encodedItems = items
    .map((item) => {
      const amount = item.amount.toFixed(2)

      if (isGitHubUser(item)) {
        // For users: u_<github_user_id>_<amount>
        return `u_${item.user.id}_${amount}`
      } else if (isGitHubRepo(item)) {
        // For repos: r_<github_repo_id>_<amount>
        return `r_${item.repo.id}_${amount}`
      }
      return ''
    })
    .filter(Boolean)

  const url = new URL('https://terminal.merit.systems/checkout')
  url.searchParams.set('items', JSON.stringify(encodedItems))
  return url.toString()
}
