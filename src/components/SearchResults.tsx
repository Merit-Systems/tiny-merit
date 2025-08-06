import { Book, Check, User } from 'lucide-react'
import type { MeritItem, SearchRepoResult, SearchUserResult } from '../types'
import { isGitHubUser } from '../types'

interface SearchResultsProps {
  userResults: SearchUserResult[]
  repoResults: SearchRepoResult[]
  onAddItem: (item: MeritItem) => void
  onRemoveItem: (id: string) => void
  existingItems: MeritItem[]
}

export function SearchResults({
  userResults,
  repoResults,
  onAddItem,
  onRemoveItem,
  existingItems,
}: SearchResultsProps) {
  const getExistingItem = (
    result: SearchUserResult | SearchRepoResult
  ): MeritItem | undefined => {
    return existingItems.find((item) => {
      if ('login' in result && isGitHubUser(item)) {
        return item.user.id === result.id
      } else if ('owner' in result && !isGitHubUser(item)) {
        return item.repo.id === result.id
      }
      return false
    })
  }

  const handleItemClick = (result: SearchUserResult | SearchRepoResult) => {
    const existingItem = getExistingItem(result)

    if (existingItem) {
      onRemoveItem(result.id.toString())
    } else {
      if ('login' in result) {
        onAddItem({ user: result, amount: 0 })
      } else {
        onAddItem({ repo: result, amount: 0 })
      }
    }
  }

  if (userResults.length === 0 && repoResults.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="space-y-1">
        {userResults.map((result) => {
          const existingItem = getExistingItem(result)
          const exists = !!existingItem
          return (
            <div
              key={result.id}
              className={`flex items-center gap-2 w-full p-2 border border-border rounded-md cursor-pointer transition-colors ${
                exists
                  ? 'bg-muted text-muted-foreground hover:bg-accent'
                  : 'bg-card hover:bg-accent'
              }`}
              onClick={() => handleItemClick(result)}
            >
              <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <img
                src={result.avatar_url}
                alt={result.login}
                className="w-4 h-4 rounded-full flex-shrink-0"
              />
              <span className="text-sm font-medium truncate">
                {result.login}
              </span>
              {exists && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Check className="w-3 h-3 text-green-500" />
                </span>
              )}
            </div>
          )
        })}

        {repoResults.map((result) => {
          const existingItem = getExistingItem(result)
          const exists = !!existingItem
          return (
            <div
              key={result.id}
              className={`flex items-center gap-2 w-full p-2 border border-border rounded-md cursor-pointer transition-colors ${
                exists
                  ? 'bg-muted text-muted-foreground hover:bg-accent'
                  : 'bg-card hover:bg-accent'
              }`}
              onClick={() => handleItemClick(result)}
            >
              <Book className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              {result.owner?.avatar_url && (
                <img
                  src={result.owner.avatar_url}
                  alt={result.owner.login}
                  className="w-4 h-4 rounded-full flex-shrink-0"
                />
              )}
              <span className="text-sm font-medium truncate">
                {result.owner?.login}/{result.name}
              </span>
              {exists && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Check className="w-3 h-3 text-green-500" />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
