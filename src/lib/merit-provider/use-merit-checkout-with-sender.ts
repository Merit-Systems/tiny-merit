import { useMemo } from 'react'
import { useMerit } from './use-merit'

// Hook for checkout operations with automatic sender ID and redirect support
export function useMeritCheckoutWithSender(senderGithubId?: number) {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      generateCheckoutUrl: (
        items: Parameters<typeof sdk.checkout.generateCheckoutUrl>[0]['items'],
        options?: {
          groupId?: string
          redirectUrl?: string
        }
      ) => {
        const url = sdk.checkout.generateCheckoutUrl({
          items,
          groupId: options?.groupId,
          senderGithubId,
        })

        // Add redirect URL as query parameter if provided
        if (options?.redirectUrl) {
          const urlObj = new URL(url)
          urlObj.searchParams.set('redirect', options.redirectUrl)
          return urlObj.toString()
        }

        return url
      },
      generateGroupId: () => sdk.checkout.generateGroupId(),
    }),
    [sdk, senderGithubId]
  )
}
