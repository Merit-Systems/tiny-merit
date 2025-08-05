import { Button } from './ui/button'
import logoSvg from '../assets/logo.svg'
import type { MeritItem } from '../types'
import { isGitHubUser, isGitHubRepo } from '../types'
import { ExternalLink } from 'lucide-react'

interface CheckoutSectionProps {
  items: MeritItem[]
}

export function CheckoutSection({ items }: CheckoutSectionProps) {
  if (items.length === 0) {
    return null
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const handleCheckout = () => {
    window.open(generateCheckoutUrl(items), '_blank')
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

const generateCheckoutUrl = (items: MeritItem[]) => {
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
