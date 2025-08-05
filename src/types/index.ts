import { Octokit } from '@octokit/rest'

export type GitHubUserData = Awaited<
  ReturnType<Octokit['rest']['users']['getByUsername']>
>['data']

export type GitHubRepoData = Awaited<
  ReturnType<Octokit['rest']['repos']['get']>
>['data']

export type SearchUserResult = Awaited<
  ReturnType<Octokit['rest']['search']['users']>
>['data']['items'][0]

export type SearchRepoResult = Awaited<
  ReturnType<Octokit['rest']['search']['repos']>
>['data']['items'][0]

export interface GitHubUser {
  id: string
  username: string
  amount: number
  userData?: GitHubUserData
  isLoading?: boolean
  error?: string
}

export interface GitHubRepo {
  id: string
  owner: string
  name: string
  amount: number
  repoData?: GitHubRepoData
  isLoading?: boolean
  error?: string
}

export type MeritItem = GitHubUser | GitHubRepo

export function isGitHubUser(item: MeritItem): item is GitHubUser {
  return 'username' in item
}

export function isGitHubRepo(item: MeritItem): item is GitHubRepo {
  return 'owner' in item && 'name' in item
}