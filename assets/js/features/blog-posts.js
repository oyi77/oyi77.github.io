/**
 * Blog Posts Display & Filtering
 * Terminal-themed blog aggregator with filtering, search, and smooth animations
 */

(function () {
  'use strict';

  class BlogPostsApp {
    constructor() {
      this.posts = [];
      this.filteredPosts = [];
      this.currentFilter = 'all';
      this.searchQuery = '';
      this.sourceIcons = {
        'Medium': '📝',
        'Dev.to': '💻',
        'Substack': '📰',
        'Publish0x': '✍️',
        'Twitter': '🐦',
        'GitHub': '🐙',
        'GitLab': '🦊',
        'Bitbucket': '🔷',
        'Quora': '❓'
      };
      this.sourceColors = {
        'Medium': '#00a862',
        'Dev.to': '#0a0a0a',
        'Substack': '#ff6719',
        'Publish0x': '#ff6b35',
        'Twitter': '#1da1f2',
        'GitHub': '#24292e',
        'GitLab': '#fc6d26',
        'Bitbucket': '#0052cc',
        'Quora': '#b92b27'
      };
      this.init();
    }

    init() {
      this.loadPosts();
      this.setupEventListeners();
      this.setupStickyHeader();
    }

    loadPosts() {
      // Load posts from Jekyll data
      const data = window.JEKYLL_DATA?.blog?.posts || [];
      this.posts = Array.isArray(data) ? data : [];
      this.posts.sort((a, b) => {
        const dateA = new Date(a.published_date || 0);
        const dateB = new Date(b.published_date || 0);
        return dateB - dateA; // Newest first
      });
      this.filteredPosts = [...this.posts];
      this.render();
    }

    setupEventListeners() {
      // Filter buttons
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const filter = btn.getAttribute('data-filter');
          this.setFilter(filter);
        });
      });

      // Search input
      const searchInput = document.getElementById('blog-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.setSearchQuery(e.target.value.trim());
        });

        // Keyboard shortcuts
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.target.value = '';
            this.setSearchQuery('');
          }
        });
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          if (searchInput) searchInput.focus();
        }
      });

      // Sticky header search input
      const stickySearchInput = document.getElementById('blog-sticky-search-input');
      if (stickySearchInput) {
        stickySearchInput.addEventListener('input', (e) => {
          const query = e.target.value.trim();
          this.setSearchQuery(query);
          // Sync with main search
          if (searchInput) searchInput.value = query;
        });

        // Sync main search to sticky search
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            stickySearchInput.value = e.target.value;
          });
        }
      }

      // Sticky header dropdown
      const sourceDropdown = document.getElementById('blog-source-dropdown');
      if (sourceDropdown) {
        sourceDropdown.addEventListener('change', (e) => {
          this.setFilter(e.target.value);
        });
      }
    }

    setupStickyHeader() {
      const stickyHeader = document.getElementById('blog-sticky-header');
      const blogHeader = document.querySelector('.blog-header');
      if (!stickyHeader || !blogHeader) return;

      let lastScrollY = window.scrollY;
      let ticking = false;

      const updateStickyHeader = () => {
        const scrollY = window.scrollY;
        const headerBottom = blogHeader.offsetTop + blogHeader.offsetHeight;
        
        if (scrollY > headerBottom + 20) {
          stickyHeader.classList.add('visible');
          document.body.classList.add('sticky-active');
        } else {
          stickyHeader.classList.remove('visible');
          document.body.classList.remove('sticky-active');
        }
        
        lastScrollY = scrollY;
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateStickyHeader);
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      
      // Sync dropdown with current filter
      const sourceDropdown = document.getElementById('blog-source-dropdown');
      if (sourceDropdown) {
        // Update dropdown when filter changes
        const originalSetFilter = this.setFilter.bind(this);
        this.setFilter = (filter) => {
          originalSetFilter(filter);
          if (sourceDropdown) {
            sourceDropdown.value = filter;
          }
        };
      }
    }

    setFilter(filter) {
      this.currentFilter = filter;
      
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
      });

      // Update dropdown
      const sourceDropdown = document.getElementById('blog-source-dropdown');
      if (sourceDropdown) {
        sourceDropdown.value = filter;
      }

      this.applyFilters();
    }

    setSearchQuery(query) {
      this.searchQuery = query.toLowerCase();
      this.applyFilters();
    }

    applyFilters() {
      this.filteredPosts = this.posts.filter(post => {
        // Source filter
        if (this.currentFilter !== 'all') {
          const sourceMatch = this.getSourceKey(post.source) === this.currentFilter;
          if (!sourceMatch) return false;
        }

        // Search filter
        if (this.searchQuery) {
          const searchableText = [
            post.title || '',
            post.excerpt || '',
            post.tags?.join(' ') || '',
            post.categories?.join(' ') || ''
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(this.searchQuery)) {
            return false;
          }
        }

        return true;
      });

      this.render();
    }

    getSourceKey(source) {
      if (!source) return '';
      const normalized = source.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mapping = {
        'medium': 'medium',
        'devto': 'dev.to',
        'substack': 'substack',
        'publish0x': 'publish0x',
        'twitter': 'twitter',
        'x': 'twitter',
        'github': 'github',
        'gitlab': 'gitlab',
        'bitbucket': 'bitbucket',
        'quora': 'quora'
      };
      return mapping[normalized] || normalized;
    }

    render() {
      const container = document.getElementById('blog-posts');
      const emptyState = document.getElementById('blog-empty');
      
      if (!container) return;

      // Show/hide empty state
      if (this.filteredPosts.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      container.style.display = 'block';
      if (emptyState) emptyState.style.display = 'none';

      // Remove loading state
      container.innerHTML = '';

      // Render posts with animation
      this.filteredPosts.forEach((post, index) => {
        const postElement = this.createPostCard(post);
        postElement.style.opacity = '0';
        postElement.style.transform = 'translateY(20px)';
        container.appendChild(postElement);

        // Stagger animation
        setTimeout(() => {
          postElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          postElement.style.opacity = '1';
          postElement.style.transform = 'translateY(0)';
        }, index * 50);
      });
    }

    createPostCard(post) {
      const card = document.createElement('article');
      card.className = 'blog-post-card';
      card.setAttribute('data-source', this.getSourceKey(post.source || ''));
      
      const source = post.source || 'Unknown';
      const sourceKey = this.getSourceKey(source);
      const icon = this.sourceIcons[source] || '📄';
      const color = this.sourceColors[source] || '#888';
      const date = this.formatDate(post.published_date);
      const excerpt = this.truncateText(post.excerpt || '', 150);

      card.innerHTML = `
        <div class="post-header">
          <div class="post-source">
            <span class="source-icon" style="color: ${color}">${icon}</span>
            <span class="source-name">${source}</span>
          </div>
          <time class="post-date" datetime="${post.published_date || ''}">${date}</time>
        </div>
        <h2 class="post-title">
          <a href="${post.link || '#'}" target="_blank" rel="noopener noreferrer" aria-label="Read ${post.title || 'post'}">
            ${this.escapeHtml(post.title || 'Untitled')}
          </a>
        </h2>
        ${excerpt ? `<p class="post-excerpt">${this.escapeHtml(excerpt)}</p>` : ''}
        <div class="post-footer">
          <div class="post-tags">
            ${this.renderTags(post.tags || [])}
            ${this.renderCategories(post.categories || [])}
          </div>
          <a href="${post.link || '#'}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="read-more-btn"
             aria-label="Read full article: ${post.title || 'post'}">
            Read More →
          </a>
        </div>
      `;

      // Add hover effect
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = `0 8px 24px rgba(0, 255, 65, 0.2)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });

      return card;
    }

    renderTags(tags) {
      if (!tags || tags.length === 0) return '';
      return tags.slice(0, 3).map(tag => 
        `<span class="post-tag">${this.escapeHtml(tag)}</span>`
      ).join('');
    }

    renderCategories(categories) {
      if (!categories || categories.length === 0) return '';
      return categories.slice(0, 2).map(cat => 
        `<span class="post-category">${this.escapeHtml(cat)}</span>`
      ).join('');
    }

    formatDate(dateString) {
      if (!dateString) return 'Date unknown';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (e) {
        return 'Date unknown';
      }
    }

    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    resetFilters() {
      this.currentFilter = 'all';
      this.searchQuery = '';
      
      // Reset UI
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
      });
      
      const searchInput = document.getElementById('blog-search-input');
      if (searchInput) searchInput.value = '';

      this.applyFilters();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.blogPostsApp = new BlogPostsApp();
    });
  } else {
    window.blogPostsApp = new BlogPostsApp();
  }
})();

