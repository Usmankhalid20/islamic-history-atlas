# Project Overview

## 1. Purpose

Build a research-oriented, interactive atlas that helps people understand the political geography and historical development of Islamic dynasties across different periods.

The application should answer questions such as:

- Which dynasties existed in a selected year?
- Which regions did each dynasty control at that time?
- Which rulers governed a dynasty during a selected period?
- What major events changed political control?
- What sources support a date, event, ruler, or territory?

## 2. Product direction

The experience should feel like a digital historical atlas or museum archive, not a generic SaaS dashboard or a blog template.

Primary interaction:
1. A user opens the Explore page.
2. The map displays a selected year.
3. The user moves the year slider or enters a year.
4. The map updates to show all applicable territorial records.
5. The user selects a territory or dynasty to open a concise information panel.
6. The user can navigate to dynasty, ruler, and event details and inspect sources.

## 3. Target users

- Students and independent learners
- History enthusiasts
- Teachers and educational creators
- Researchers who need an accessible starting point for exploration

This is an educational reference product, not a substitute for specialist historical scholarship.

## 4. Initial scope (MVP)

Keep the first release deliberately small:
- One coherent date range, initially proposed as the 7th–10th centuries.
- A limited, reviewed set of dynasties and rulers.
- A small number of important events.
- An interactive map with multiple simultaneous territory layers.
- A year selector/timeline.
- Dynasty, ruler, and event detail pages or panels.
- Visible references and a clear uncertainty policy.

The exact regions, entities, and records must be chosen during historical research. Do not promise broad coverage until the data has been reviewed.

## 5. Out of scope for the first release

- A complete history of every Islamic polity
- User-generated historical edits
- Public accounts, comments, likes, or social features
- Complex 3D globe rendering
- Real-time collaboration
- Microservices, Kubernetes, or a distributed architecture
- An AI-generated history chatbot

These may be considered later only if a demonstrated user need justifies them.

## 6. Product success criteria

The MVP is useful when:
- A user can select a year and see more than one relevant polity where history requires it.
- Territory changes correctly when the selected year changes.
- Each displayed historical claim can be traced to a source record.
- Uncertain dates and approximate boundaries are communicated honestly.
- The interface remains usable on desktop and mobile.
- Core interactions have automated tests.
