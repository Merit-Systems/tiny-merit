import { useEffect, useState } from 'react'
import { searchGitHubUsers } from '../github'
import type { GitHubUserData, SearchUserResult } from '../types'
import { Card } from './ui/card'

interface UserSettingsProps {
  onUserChange: (user: GitHubUserData | null) => void
}

export function UserSettings({ onUserChange }: UserSettingsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<GitHubUserData | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [tempApiKey, setTempApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  // Load saved user and API key from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('merit-sender-user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setSelectedUser(user)
        onUserChange(user)
      } catch (error) {
        console.warn('Failed to parse saved user:', error)
        localStorage.removeItem('merit-sender-user')
      }
    }

    const savedApiKey = localStorage.getItem('merit-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setTempApiKey(savedApiKey)
    }
  }, [onUserChange])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    try {
      const results = await searchGitHubUsers(query, 5)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectUser = (user: SearchUserResult) => {
    // Use type assertion to convert SearchUserResult to GitHubUserData
    // Both types represent GitHub user data, just with slightly different optional field handling
    const convertedUser = user as GitHubUserData

    setSelectedUser(convertedUser)
    setSearchQuery('')
    setShowResults(false)
    setSearchResults([])

    // Save to localStorage
    localStorage.setItem('merit-sender-user', JSON.stringify(convertedUser))

    // Notify parent
    onUserChange(convertedUser)
  }

  const handleClearUser = () => {
    setSelectedUser(null)
    localStorage.removeItem('merit-sender-user')
    onUserChange(null)
  }

  const handleSaveApiKey = () => {
    const trimmedKey = tempApiKey.trim()
    setApiKey(trimmedKey)

    if (trimmedKey) {
      localStorage.setItem('merit-api-key', trimmedKey)
    } else {
      localStorage.removeItem('merit-api-key')
    }

    // Dispatch custom event to notify other components of API key change
    window.dispatchEvent(new CustomEvent('merit-api-key-changed'))
    setShowApiKeyInput(false)
  }

  const handleCancelApiKey = () => {
    setTempApiKey(apiKey) // Reset to saved value
    setShowApiKeyInput(false)
  }

  const handleApiKeyToggle = () => {
    setTempApiKey(apiKey) // Initialize temp with current value
    setShowApiKeyInput(!showApiKeyInput)
  }

  const handleInputChange = (value: string) => {
    setSearchQuery(value)

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Account Settings</h3>

      {/* GitHub User Section */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          GitHub Account
        </label>
        {selectedUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser.avatar_url}
                alt={selectedUser.login}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium text-sm">@{selectedUser.login}</p>
                <p className="text-xs text-gray-500">ID: {selectedUser.id}</p>
              </div>
            </div>
            <button
              onClick={handleClearUser}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for your GitHub username..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />

              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
                      >
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">@{user.login}</p>
                          {user.name && (
                            <p className="text-xs text-gray-500">{user.name}</p>
                          )}
                        </div>
                      </button>
                    ))
                  ) : searchQuery.trim() && !isSearching ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      No users found
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Select your GitHub account to view your Merit balance and payment
              history.
            </p>
          </div>
        )}
      </div>

      {/* API Key Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Merit API Key
          </label>
          <button
            onClick={handleApiKeyToggle}
            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
          >
            {apiKey ? 'Change' : 'Add API Key'}
          </button>
        </div>

        {showApiKeyInput || !apiKey ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your Merit API key..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              {apiKey && (
                <button
                  onClick={handleCancelApiKey}
                  className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Your API key is stored locally and used to authenticate with Merit
              services.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              ••••••••••••{apiKey.slice(-4)}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Configured
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
