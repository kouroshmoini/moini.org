---
title: "REPLACE: Project title"
date: "2026-11-13"
permalink: /projects/replace-project-slug/
kind: "Planning project"
project_period: "REPLACE: supported study period"
# Optional hero_image, hero_alt, hero_caption and card_image use the existing project media.
# See PUBLISHING.md for image dimensions, evidence and authorship conventions.
subtitle: "REPLACE: the planning question and scope in one sentence."
context: "REPLACE: individual or team project context, supported by the source."
facts:
  - {label: Location, value: "REPLACE"}
  - {label: Deliverables, value: "REPLACE"}
skills: ["REPLACE: demonstrated method"]
sections:
  - {id: context-and-objective, title: Context & objective}
  - {id: methods, title: Methods}
  - {id: findings-and-proposal, title: Findings & proposal}
  - {id: limitations-and-next-steps, title: Limitations & next steps}
  - {id: sources, title: Sources}
---

## Context and objective

REPLACE: Explain the place, planning problem, and question the project addresses.

## Methods

REPLACE: Describe what was actually done, using which sources and tools, and how it informed the work. Do not list unsupported skills.

## Findings and proposal

REPLACE: Present the evidence and explain the proposal. Use the shared figure include for maps and illustrations. Label proposed outcomes clearly.

{% comment %}
Optional visual study. Copy only the components supported by this project.
For a sequence of maps or proposals, define records in _data/your_project.yml
with label, src, alt, optional caption, heading and body (the finding).
Then place the include here and add its id to sections above.

{% include comparison.html id="circulation" title="Circulation" items=site.data.your_project.circulation %}

For a narrative, wrap alternating Markdown paragraphs and figure.html includes in
<div data-sequence="narrative" markdown="1"> ... </div>.
For an illustrated gallery, use <div data-sequence="plates" markdown="1"> and
two figure.html includes with captions for a paired study. Each image has its
own enlargement control. Use comparison.html for a continuous illustrated narrative.
For key figures, provide title, items (label, value, detail), and a source note.
{% include project-statistics.html data=site.data.your_project.statistics %}

The post layout supplies the hero, facts, contents and related-project navigation.
{% endcomment %}

## Limitations and next steps

REPLACE: Distinguish completed analysis from further work or implementation considerations.

## Sources

REPLACE: Link the original report or supporting references. Credit team-produced material accurately without inventing individual roles.
