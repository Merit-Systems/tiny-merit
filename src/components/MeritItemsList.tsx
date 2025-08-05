import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import type { MeritItem } from '../types'
import { isGitHubUser, isGitHubRepo } from '../types'

interface MeritItemsListProps {
  items: MeritItem[]
  onUpdateAmount: (id: string, amount: number) => void
  onRemoveItem: (id: string) => void
}

export function MeritItemsList({ items, onUpdateAmount, onRemoveItem }: MeritItemsListProps) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Merit Items (0)
        </h2>
        <p className="text-muted-foreground">No items added yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Merit Items ({items.length})
      </h2>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted"
          >
            <div className="flex-1">
              {isGitHubUser(item) ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      User:
                    </span>
                    <strong className="text-foreground">
                      @{item.username}
                    </strong>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => onUpdateAmount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 h-7 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {item.isLoading && (
                      <Badge variant="secondary">Loading...</Badge>
                    )}
                    {item.error && (
                      <Badge variant="destructive">{item.error}</Badge>
                    )}
                  </div>
                  {item.userData && (
                    <div className="pt-2 border-t border-border flex items-center gap-2 text-sm">
                      <img
                        src={item.userData.avatar_url}
                        alt={item.username}
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="text-card-foreground">
                        {item.userData.name || item.username}
                      </span>
                      {item.userData.public_repos !== undefined && (
                        <span className="text-muted-foreground">
                          {item.userData.public_repos} repos
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : isGitHubRepo(item) ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      Repo:
                    </span>
                    <strong className="text-foreground">
                      {item.owner}/{item.name}
                    </strong>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => onUpdateAmount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 h-7 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {item.isLoading && (
                      <Badge variant="secondary">Loading...</Badge>
                    )}
                    {item.error && (
                      <Badge variant="destructive">{item.error}</Badge>
                    )}
                  </div>
                  {item.repoData && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-sm text-card-foreground mb-1">
                        {item.repoData.description || 'No description'}
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {item.repoData.language && (
                          <span>📝 {item.repoData.language}</span>
                        )}
                        <span>⭐ {item.repoData.stargazers_count}</span>
                        <span>🍴 {item.repoData.forks_count}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}