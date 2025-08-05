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
  user: SearchUserResult
  amount: number
}

export interface GitHubRepo {
  repo: SearchRepoResult
  amount: number
}

export type MeritItem = GitHubUser | GitHubRepo

export function isGitHubUser(item: MeritItem): item is GitHubUser {
  return 'user' in item
}

export function isGitHubRepo(item: MeritItem): item is GitHubRepo {
  return 'repo' in item
}
