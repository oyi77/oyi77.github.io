---
permalink: /blog/
title: "Blog - Technical Articles & Insights"
description: "Aggregated blog posts from Medium, Dev.to, Substack, Publish0x, Twitter, GitHub, GitLab, and more. Technical articles, insights, and thought leadership on software engineering, blockchain, trading, and full-stack development."
layout: blog
author_profile: false
tags: [blog, articles, technical, software engineering, blockchain, trading]
keywords: "software engineering blog, technical articles, blockchain development, algorithmic trading, full-stack development, remote developer blog, lead software engineer blog"
og_image: /assets/images/bio-photo.png
---

<div id="blog-container" class="blog-container">
  <div class="blog-header">
    <h1 class="blog-title">
      <span class="terminal-prompt">$</span>
      <span class="terminal-command">cat blog/*.md</span>
    </h1>
    <p class="blog-subtitle">Aggregated technical articles, insights, and thought leadership</p>
  </div>

  <div class="blog-controls">
    <div class="blog-filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="medium">Medium</button>
      <button class="filter-btn" data-filter="dev.to">Dev.to</button>
      <button class="filter-btn" data-filter="substack">Substack</button>
      <button class="filter-btn" data-filter="publish0x">Publish0x</button>
      <button class="filter-btn" data-filter="twitter">Twitter</button>
      <button class="filter-btn" data-filter="github">GitHub</button>
      <button class="filter-btn" data-filter="gitlab">GitLab</button>
    </div>
    <div class="blog-search">
      <input type="text" id="blog-search-input" class="search-input" placeholder="Search posts..." aria-label="Search blog posts">
      <span class="search-icon">🔍</span>
    </div>
  </div>

  <!-- Sticky Header (appears on scroll) -->
  <div id="blog-sticky-header" class="blog-sticky-header">
    <div class="sticky-header-content">
      <div class="sticky-search">
        <input type="text" id="blog-sticky-search-input" class="search-input" placeholder="Search posts..." aria-label="Search blog posts">
        <span class="search-icon">🔍</span>
      </div>
      <div class="sticky-source-dropdown">
        <select id="blog-source-dropdown" class="source-dropdown" aria-label="Filter by source">
          <option value="all">All Sources</option>
          <option value="medium">Medium</option>
          <option value="dev.to">Dev.to</option>
          <option value="substack">Substack</option>
          <option value="publish0x">Publish0x</option>
          <option value="twitter">Twitter</option>
          <option value="github">GitHub</option>
          <option value="gitlab">GitLab</option>
        </select>
      </div>
    </div>
  </div>

  <div id="blog-posts" class="blog-posts">
    <div class="loading-state">
      <div class="terminal-loader">
        <span class="loader-text">Loading posts...</span>
        <span class="loader-dots"></span>
      </div>
    </div>
  </div>

  <div id="blog-empty" class="blog-empty" style="display: none;">
    <p class="empty-message">No posts found matching your criteria.</p>
    <button class="reset-filters-btn" onclick="window.blogPostsApp?.resetFilters()">Reset Filters</button>
  </div>
</div>

<script src="/assets/js/features/blog-posts.js" defer></script>

