import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.VITE_MERIT_GITHUB_PAT,
})

export async function fetchGitHubUser(username: string) {
  try {
    const response = await octokit.rest.users.getByUsername({
      username: username.trim(),
    })
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to fetch user ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function fetchGitHubRepo(owner: string, repo: string) {
  try {
    const response = await octokit.rest.repos.get({
      owner: owner.trim(),
      repo: repo.trim(),
    })
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to fetch repo ${owner}/${repo}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function searchGitHubUsers(query: string, limit: number = 10) {
  try {
    const response = await octokit.rest.search.users({
      q: query.trim(),
      per_page: limit,
    })
    return response.data.items
  } catch (error) {
    throw new Error(
      `Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function searchGitHubRepos(query: string, limit: number = 10) {
  try {
    const response = await octokit.rest.search.repos({
      q: query.trim(),
      per_page: limit,
    })
    return response.data.items
  } catch (error) {
    throw new Error(
      `Failed to search repositories: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function fetchGitHubUserById(userId: number) {
  try {
    const response = await octokit.request('GET /user/{account_id}', {
      account_id: userId,
    })
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to fetch user by ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function fetchGitHubRepoById(repoId: number) {
  try {
    const response = await octokit.request(
      'GET /repositories/{repository_id}',
      {
        repository_id: repoId,
      }
    )
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to fetch repo by ID ${repoId}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
