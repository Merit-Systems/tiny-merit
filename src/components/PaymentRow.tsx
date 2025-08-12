import type { OutgoingPayment } from '@merit-systems/sdk'
import { useEffect, useState } from 'react'
import { fetchGitHubRepoById, fetchGitHubUserById } from '../github'
import type { GitHubRepoData, GitHubUserData } from '../types'

interface PaymentRowProps {
  payment: OutgoingPayment
  index: number
}

export function PaymentRow({ payment }: PaymentRowProps) {
  const [githubData, setGithubData] = useState<
    GitHubUserData | GitHubRepoData | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGithubData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (payment.type === 'UserPayment') {
          const userData = await fetchGitHubUserById(payment.recipient_id)
          setGithubData(userData)
        } else if (payment.type === 'RepoFund') {
          const repoData = await fetchGitHubRepoById(payment.repo_id)
          setGithubData(repoData)
        }
      } catch (err) {
        console.warn('Failed to fetch GitHub data:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to fetch GitHub data'
        )
        setGithubData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGithubData()
  }, [payment])

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString()
  }

  const getDisplayName = () => {
    if (loading) return 'Loading...'
    if (error || !githubData) {
      if (payment.type === 'UserPayment') {
        return `User ${payment.recipient_id}`
      } else if (payment.type === 'RepoFund') {
        return `Repo ${payment.repo_id}`
      }
    }

    if (payment.type === 'UserPayment') {
      return (githubData as GitHubUserData).login
    } else if (payment.type === 'RepoFund') {
      return (githubData as GitHubRepoData).full_name
    }

    return 'Unknown'
  }

  const getAvatarUrl = () => {
    if (!githubData) return null

    if (payment.type === 'UserPayment') {
      return (githubData as GitHubUserData).avatar_url
    } else if (payment.type === 'RepoFund') {
      return (githubData as GitHubRepoData).owner.avatar_url
    }

    return null
  }

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50/50 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {loading ? (
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        ) : getAvatarUrl() ? (
          <img
            src={getAvatarUrl()!}
            alt={getDisplayName()}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {payment.type === 'UserPayment' ? 'U' : 'R'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <p className="font-medium text-sm text-gray-900 truncate">
            {getDisplayName()}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{formatDate(payment.timestamp)}</span>
          {payment.group_id && (
            <span className="text-gray-400">
              • Group: {payment.group_id.substring(0, 8)}...
            </span>
          )}
          {error && (
            <span className="text-red-400">• Failed to load GitHub data</span>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className="font-semibold text-sm text-gray-900">
          {payment.amount.formatted}
        </p>
        <p className="text-xs text-green-600 font-medium">sent</p>
      </div>
    </div>
  )
}
