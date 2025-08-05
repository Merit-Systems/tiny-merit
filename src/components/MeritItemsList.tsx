import { Book, Trash2, User } from 'lucide-react'
import type { MeritItem } from '../types'
import { isGitHubRepo, isGitHubUser } from '../types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { NumericInput } from './ui/numeric-input'

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
          Receivers (0)
        </h2>
        <p className="text-muted-foreground">No items added yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Receivers ({items.length})
      </h2>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={item.id}
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
                </div>
              ) : isGitHubRepo(item) ? (
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-foreground truncate">
                        {item.repo.owner?.login}/{item.repo.name}
                      </strong>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.repo.description || 'No description'}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {item.repo.language && (
                        <span>📝 {item.repo.language}</span>
                      )}
                      <span>⭐ {item.repo.stargazers_count}</span>
                      <span>🍴 {item.repo.forks_count}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-1">
                <span className="text-xs">$</span>
                <NumericInput
                  value={item.amount}
                  onChange={(value) => {
                    const id = isGitHubUser(item) ? item.user.id.toString() : item.repo.id.toString()
                    onUpdateAmount(id, value)
                  }}
                  className="w-40 h-6 text-xs bg-background"
                  decimalPlaces={2}
                  minimumValue={0}
                  maximumValue={999999}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const id = isGitHubUser(item) ? item.user.id.toString() : item.repo.id.toString()
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
