class GitHubClient {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.username = null; // Will be set from config or detected
    this.cache = null;
    this.cacheTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes

    // Try to load username from JEKYLL_DATA
    if (window.JEKYLL_DATA && window.JEKYLL_DATA.site && window.JEKYLL_DATA.site.github_username) {
      this.username = window.JEKYLL_DATA.site.github_username;
      console.log('GitHub username loaded from JEKYLL_DATA:', this.username);
    }
  }
} catch (e) { }

// Try to get from _config.yml
try {
  const response = await fetch('/_config.yml');
  if (response.ok) {
    const text = await response.text();
    const match = text.match(/github_username:\s*(.+)/);
    if (match) {
      this.username = match[1].trim().replace(/^["']|["']$/g, '');
      return this.username;
    }
  }
} catch (e) { }

// Default fallback - extract from current domain
const hostname = window.location.hostname;
const match = hostname.match(/^([^.]+)\.github\.io$/);
if (match) {
  this.username = match[1];
  return this.username;
}

throw new Error('Could not determine GitHub username');
  }

  async getRepositories() {
  const username = await this.getUsername();
  const url = `${this.baseUrl}/users/${username}/repos?per_page=100&sort=updated`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

  async checkPagesEnabled(repo) {
  // Check if repository has GitHub Pages enabled
  // We'll check by trying to access the pages URL pattern
  const username = await this.getUsername();
  const pagesUrl = `https://${username}.github.io/${repo.name}`;

  // For user/organization sites, check if repo name matches username
  if (repo.name === `${username}.github.io`) {
    return {
      enabled: true,
      url: `https://${username}.github.io`
    };
  }

  // For project sites, check if pages is enabled
  // We can't directly check via API without auth, so we'll use heuristics
  // and try to fetch the static projects.json first
  try {
    // Try to fetch from the repo's pages
    const testResponse = await fetch(pagesUrl, { method: 'HEAD' });
    if (testResponse.ok || testResponse.status === 200) {
      return {
        enabled: true,
        url: pagesUrl
      };
    }
  } catch (e) {
    // Pages might not be enabled or URL might be different
  }

  // Check if repo has pages branch or gh-pages branch
  if (repo.has_pages) {
    // If repo.default_branch is gh-pages or docs folder exists
    const pagesUrl = repo.name === `${username}.github.io`
      ? `https://${username}.github.io`
      : `https://${username}.github.io/${repo.name}`;

    return {
      enabled: true,
      url: pagesUrl
    };
  }

  return {
    enabled: false,
    url: null
  };
}

  async getPagesProjects() {
  // Check cache
  if (this.cache && this.cacheTime && (Date.now() - this.cacheTime) < this.cacheTimeout) {
    return this.cache;
  }

  try {
    const repos = await this.getRepositories();
    const projects = [];

    for (const repo of repos) {
      // Skip private repos (we can't check without auth, but assume public)
      if (repo.private) continue;

      const pagesInfo = await this.checkPagesEnabled(repo);

      if (pagesInfo.enabled) {
        projects.push({
          name: repo.name,
          description: repo.description || 'No description',
          url: repo.html_url,
          pagesUrl: pagesInfo.url,
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count || 0,
          updated: repo.updated_at
        });
      }
    }

    // Sort by updated date (most recent first)
    projects.sort((a, b) => new Date(b.updated) - new Date(a.updated));

    // Cache results
    this.cache = projects;
    this.cacheTime = Date.now();

    return projects;
  } catch (error) {
    console.error('Error getting pages projects:', error);
    // Return empty array on error
    return [];
  }
}
}

window.GitHubClient = GitHubClient;

