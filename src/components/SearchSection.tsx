import { useState } from 'react'
import { searchGitHubRepos, searchGitHubUsers } from '../github'
import type { MeritItem, SearchRepoResult, SearchUserResult } from '../types'
import { SearchResults } from './SearchResults'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface SearchSectionProps {
  onAddItem: (item: MeritItem) => void
  onRemoveItem: (id: string) => void
  existingItems: MeritItem[]
}

export function SearchSection({
  onAddItem,
  onRemoveItem,
  existingItems,
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [userResults, setUserResults] = useState<SearchUserResult[]>([])
  const [repoResults, setRepoResults] = useState<SearchRepoResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setUserResults([])
      setRepoResults([])
      return
    }

    setIsSearching(true)
    try {
      const [users, repos] = await Promise.all([
        searchGitHubUsers(searchQuery),
        searchGitHubRepos(searchQuery),
      ])
      setUserResults(users)
      setRepoResults(repos)
    } catch (error) {
      console.error('Search failed:', error)
      setUserResults([])
      setRepoResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mb-12 p-6 border border-border rounded-lg bg-card">
      <h2 className="mb-4 text-xl font-semibold text-card-foreground">
        Search GitHub
      </h2>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search users and repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && performSearch()}
          className="flex-1"
        />
        <Button
          onClick={performSearch}
          disabled={isSearching}
          variant="secondary"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <SearchResults
        userResults={userResults}
        repoResults={repoResults}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        existingItems={existingItems}
      />
    </div>
  )
}
