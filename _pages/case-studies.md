---
permalink: /case-studies/
title: "Case Studies"
description: "Detailed case studies showcasing problem-solving approaches, technical solutions, and business impact across various projects and companies."
layout: single
author_profile: false
---

# Case Studies

Detailed case studies demonstrating problem-solving approaches, technical implementations, and measurable business impact.

{% assign case_studies = site.data.case_studies.case_studies %}

<div class="case-studies-grid">
  {% for study in case_studies %}
  <article class="case-study-card">
    <div class="case-study-header">
      <h2><a href="/case-studies/{{ study.id }}/">{{ study.title }}</a></h2>
      <span class="company-badge">{{ study.company }}</span>
    </div>
    <div class="case-study-meta">
      <span class="period">{{ study.period }}</span>
      <span class="role">{{ study.role }}</span>
    </div>
    <div class="case-study-summary">
      <h3>Challenge</h3>
      <p>{{ study.challenge | truncate: 200 }}</p>
    </div>
    <div class="case-study-results">
      <h3>Results</h3>
      <ul>
        {% for metric in study.metrics %}
        <li><strong>{{ metric.metric }}:</strong> {{ metric.value }}</li>
        {% endfor %}
      </ul>
    </div>
    <div class="case-study-tech">
      <h3>Technologies</h3>
      <div class="tech-tags">
        {% for tech in study.technologies %}
        <span class="tech-tag">{{ tech }}</span>
        {% endfor %}
      </div>
    </div>
    <a href="/case-studies/{{ study.id }}/" class="read-more">Read Full Case Study →</a>
  </article>
  {% endfor %}
</div>

<style>
.case-studies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.case-study-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.case-study-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.case-study-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.case-study-header h2 {
  margin: 0;
  flex: 1;
}

.case-study-header h2 a {
  text-decoration: none;
  color: inherit;
}

.company-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.case-study-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.case-study-summary,
.case-study-results,
.case-study-tech {
  margin-bottom: 1rem;
}

.case-study-summary h3,
.case-study-results h3,
.case-study-tech h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.read-more {
  display: inline-block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}
</style>

