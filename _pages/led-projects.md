---
permalink: /led-projects/
title: "Led Projects"
description: "Projects I've led as Technical Lead, showcasing team leadership, technical expertise, and business impact."
layout: single
author_profile: false
---

# Led Projects

Projects I've led as Technical Lead, demonstrating leadership, technical expertise, and measurable business impact.

{% assign projects = site.data.led_projects.led_projects %}

<div class="projects-grid">
  {% for project in projects %}
  <article class="project-card">
    <div class="project-header">
      <h2>{{ project.name }}</h2>
      <span class="company-badge">{{ project.company }}</span>
    </div>
    <div class="project-meta">
      <span><strong>Period:</strong> {{ project.period }}</span>
      <span><strong>Team Size:</strong> {{ project.team_size }}</span>
      <span><strong>Role:</strong> {{ project.role }}</span>
    </div>
    <div class="project-description">
      <p>{{ project.description }}</p>
    </div>
    <div class="project-challenge">
      <h3>Challenge</h3>
      <p>{{ project.challenge }}</p>
    </div>
    <div class="project-solution">
      <h3>Solution</h3>
      <p>{{ project.solution }}</p>
    </div>
    <div class="project-outcomes">
      <h3>Outcomes</h3>
      <ul>
        {% for outcome in project.outcomes %}
        <li>{{ outcome }}</li>
        {% endfor %}
      </ul>
    </div>
    <div class="project-metrics">
      <h3>Key Metrics</h3>
      <ul>
        {% for metric in project.metrics %}
        <li><strong>{{ metric.metric }}:</strong> {{ metric.value }}</li>
        {% endfor %}
      </ul>
    </div>
    <div class="project-tech">
      <h3>Technologies</h3>
      <div class="tech-tags">
        {% for tech in project.technologies %}
        <span class="tech-tag">{{ tech }}</span>
        {% endfor %}
      </div>
    </div>
    <div class="project-impact">
      <h3>Business Impact</h3>
      <p>{{ project.business_impact }}</p>
    </div>
  </article>
  {% endfor %}
</div>

<style>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.project-header h2 {
  margin: 0;
  flex: 1;
}

.company-badge {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.project-description,
.project-challenge,
.project-solution,
.project-outcomes,
.project-metrics,
.project-tech,
.project-impact {
  margin-bottom: 1rem;
}

.project-description h3,
.project-challenge h3,
.project-solution h3,
.project-outcomes h3,
.project-metrics h3,
.project-tech h3,
.project-impact h3 {
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
</style>

