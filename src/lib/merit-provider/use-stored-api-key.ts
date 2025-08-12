import { useEffect, useState } from 'react'

export function useStoredApiKey(): string {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    // Load API key from localStorage
    const loadApiKey = () => {
      const storedKey = localStorage.getItem('merit-api-key')
      if (storedKey) {
        setApiKey(storedKey)
      }
    }

    // Load initial value
    loadApiKey()

    // Listen for storage changes to update API key when it changes in other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'merit-api-key') {
        setApiKey(e.newValue || '')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events for same-tab updates
    const handleCustomStorageChange = () => {
      loadApiKey()
    }

    window.addEventListener('merit-api-key-changed', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(
        'merit-api-key-changed',
        handleCustomStorageChange
      )
    }
  }, [])

  return apiKey
}
