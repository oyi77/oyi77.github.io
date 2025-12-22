---
layout: single
author_profile: false
---

{% assign study_id = page.id | remove: '/case-studies/' | remove: '/' %}
{% assign study = site.data.case_studies.case_studies | where: "id", study_id | first %}

{% if study %}
# {{ study.title }}

<div class="case-study-meta">
  <span><strong>Company:</strong> {{ study.company }}</span>
  <span><strong>Period:</strong> {{ study.period }}</span>
  <span><strong>Role:</strong> {{ study.role }}</span>
</div>

## Problem Statement

{{ study.problem }}

## Company Context

{{ study.company_context }}

## Challenge

{{ study.challenge }}

## Approach

{{ study.approach }}

## Solution

{{ study.solution }}

## Technical Details

{{ study.technical_details }}

## Architecture

{{ study.architecture }}

## Implementation

{{ study.implementation }}

## Results

{{ study.results }}

### Key Metrics

<ul>
{% for metric in study.metrics %}
  <li><strong>{{ metric.metric }}:</strong> {{ metric.value }}</li>
{% endfor %}
</ul>

## My Role

{{ study.my_role }}

## Outcome

{{ study.outcome }}

## Technologies Used

<div class="tech-list">
{% for tech in study.technologies %}
  <span class="tech-badge">{{ tech }}</span>
{% endfor %}
</div>

<style>
.case-study-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tech-badge {
  background: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>

{% else %}
# Case Study Not Found

The requested case study could not be found.

[← Back to Case Studies](/case-studies/)
{% endif %}

