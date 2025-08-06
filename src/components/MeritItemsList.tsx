import { Trash2 } from 'lucide-react'
import type { MeritItem } from '../types'
import { isGitHubRepo, isGitHubUser } from '../types'
import { Button } from './ui/button'
import { MoneyInput } from './ui/numeric-input'

interface MeritItemsListProps {
  items: MeritItem[]
  onUpdateAmount: (id: string, amount: number) => void
  onRemoveItem: (id: string) => void
}

export function MeritItemsList({
  items,
  onUpdateAmount,
  onRemoveItem,
}: MeritItemsListProps) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Payees (0)
        </h2>
        <p className="text-muted-foreground">No items added yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Payees ({items.length})
      </h2>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={isGitHubUser(item) ? item.user.id : item.repo.id}
            className="flex items-center justify-between p-2 border border-border rounded bg-muted"
          >
            <div className="flex-1 min-w-0">
              {isGitHubUser(item) ? (
                <div className="flex items-center gap-2">
                  <img
                    src={item.user.avatar_url}
                    alt={item.user.login}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-foreground truncate">
                        @{item.user.login}
                      </strong>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">User</span>
                </div>
              ) : isGitHubRepo(item) ? (
                <div className="flex items-center gap-2">
                  <img
                    src={item.repo.owner?.avatar_url}
                    alt={item.repo.owner?.login}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-foreground truncate">
                        {item.repo.owner?.login}/{item.repo.name}
                      </strong>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Repo</span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-1">
                <MoneyInput
                  setAmount={(amount) => {
                    const id = isGitHubUser(item)
                      ? item.user.id.toString()
                      : item.repo.id.toString()
                    onUpdateAmount(id, amount)
                  }}
                  placeholder="Amount"
                  decimalPlaces={2}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const id = isGitHubUser(item)
                    ? item.user.id.toString()
                    : item.repo.id.toString()
                  onRemoveItem(id)
                }}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
