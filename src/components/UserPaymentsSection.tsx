import type { OutgoingPayment, UserBalance } from '@merit-systems/sdk'
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@merit-systems/sdk'
import { useEffect, useState } from 'react'
import { useMeritBalances, useMeritPayments } from '../lib/merit-provider'
import type { GitHubUserData } from '../types'
import { PaymentGroups } from './PaymentGroups'
import { Card } from './ui/card'

interface UserPaymentsSectionProps {
  githubUser: GitHubUserData
}

export function UserPaymentsSection({ githubUser }: UserPaymentsSectionProps) {
  const [balance, setBalance] = useState<UserBalance | null>(null)
  const [sentPayments, setSentPayments] = useState<OutgoingPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { getUserBalanceByLogin } = useMeritBalances()
  const { getPaymentsBySender } = useMeritPayments()

  // Use the provided GitHub user
  const senderGithubId = githubUser.id
  const githubLogin = githubUser.login

  const getErrorInfo = (err: unknown) => {
    if (err instanceof UnauthorizedError) {
      return {
        title: 'Authentication Error',
        message:
          'Invalid API key. Please check your Merit API key in Account Settings.',
        showHint: true,
      }
    }

    if (err instanceof BadRequestError) {
      return {
        title: 'Request Error',
        message: `Bad request: ${err.message}`,
        showHint: false,
      }
    }

    if (err instanceof NotFoundError) {
      return {
        title: 'Not Found',
        message: `Resource not found: ${err.message}`,
        showHint: false,
      }
    }

    if (err instanceof InternalServerError) {
      return {
        title: 'Server Error',
        message: `Server error: ${err.message}`,
        showHint: false,
      }
    }

    if (err instanceof Error) {
      return {
        title: 'Error',
        message: err.message,
        showHint: false,
      }
    }

    return {
      title: 'Error',
      message: 'An unexpected error occurred',
      showHint: false,
    }
  }

  const refreshPayments = async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      // Fetch balance if we have GitHub login
      if (githubLogin) {
        try {
          const balanceData = await getUserBalanceByLogin(githubLogin)
          setBalance(balanceData)
        } catch (err) {
          console.warn('Could not fetch balance:', err)
          setError(err)
          return
        }
      }

      // Fetch sent payments
      try {
        const sentData = await getPaymentsBySender(senderGithubId, {
          page_size: 20,
          page: currentPage,
        })
        setSentPayments(sentData.items)
        setTotalCount(sentData.total_count)
        setHasNext(sentData.has_next)
      } catch (err) {
        console.warn('Could not fetch sent payments:', err)
        setError(err)
        return
      }
    } catch (err) {
      setError(err)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch balance if we have GitHub login
        if (githubLogin) {
          try {
            const balanceData = await getUserBalanceByLogin(githubLogin)
            setBalance(balanceData)
          } catch (err) {
            console.warn('Could not fetch balance:', err)
            setError(err)
            return
          }
        }

        // Fetch sent payments
        try {
          const sentData = await getPaymentsBySender(senderGithubId, {
            page_size: 20,
            page: currentPage,
          })
          setSentPayments(sentData.items)
          setTotalCount(sentData.total_count)
          setHasNext(sentData.has_next)
        } catch (err) {
          console.warn('Could not fetch sent payments:', err)
          setError(err)
          return
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [
    senderGithubId,
    githubLogin,
    currentPage,
    getUserBalanceByLogin,
    getPaymentsBySender,
  ])

  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Balance Section */}
      {balance && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={githubUser.avatar_url}
              alt={githubUser.login}
              className="w-16 h-16 rounded-full ring-2 ring-gray-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  @{githubUser.login}
                </h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Merit Account
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {balance.balance.formatted}
              </p>
              <p className="text-sm text-gray-500">Available Balance</p>
            </div>
          </div>
        </Card>
      )}

      {/* Sent Payments - Only show if there are payments, an error, or currently loading */}
      {(sentPayments.length > 0 || error || loading) && (
        <Card className="p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-medium">Recent Sent Payments</h3>
            <div className="flex items-center gap-3">
              {totalCount > 0 && (
                <p className="text-xs text-gray-500">
                  {totalCount} total payments
                </p>
              )}
              <button
                onClick={refreshPayments}
                disabled={isRefreshing || loading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRefreshing ? (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {sentPayments.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <PaymentGroups payments={sentPayments} />
              </div>

              {/* Pagination Controls */}
              {totalCount > 20 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t flex-shrink-0">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Page {currentPage}</span>
                    <span>•</span>
                    <span>
                      Showing {(currentPage - 1) * 20 + 1}-
                      {Math.min(currentPage * 20, totalCount)} of {totalCount}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!hasNext}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {error ? (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.315 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-600 font-medium">
                      {getErrorInfo(error).title}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {getErrorInfo(error).message}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sent payments found
                </p>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}
