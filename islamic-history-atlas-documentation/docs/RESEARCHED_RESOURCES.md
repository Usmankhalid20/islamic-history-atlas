# Research Resources Register

This file is a review register, not an endorsement or blanket permission to reuse materials. Verify current repository activity, exact license, attribution, and data provenance before adopting anything.

| Resource | Potential use | Required checks |
|---|---|---|
| OpenHistoricalMap — https://www.openhistoricalmap.org/ | Historical geographic data and map context | Data coverage, feature quality, license, attribution, temporal semantics |
| Historical Basemaps — https://github.com/aourednik/historical-basemaps | Inspiration/data exploration for historical boundaries | Exact license, source provenance, date accuracy, geometry suitability |
| Wikidata — https://www.wikidata.org/ | Entity identifiers, alternate names, dates, relationships | Statement references, conflicting values, data license, not sole authority for claims |
| Encyclopaedia Iranica — https://iranicaonline.org/ | Scholarly background on Iranian history and dynasties | Article bibliography, access terms, citation details |
| WhenAtlas — https://whenatlas.com/dataset | Explore time-aware historical datasets | Dataset coverage, schema, license, update status, source quality |

## GitHub code-library review template

Before adopting any code repository, record:
- Repository URL
- Stars and date checked (stars are not a quality guarantee)
- License and whether it permits the intended use
- Last meaningful commit/release
- Maintainer activity and open security issues
- Framework/runtime compatibility
- Dependencies and bundle-size impact
- Accessibility and test coverage
- What exact component or pattern we intend to reuse
- Why adoption is better than a small in-house implementation

## Adoption rule

Do not copy a whole UI or backend architecture just because it is popular. Prefer small, well-understood components and patterns. Every added dependency must solve a real requirement.

## Open-Source AI Agent Skills & Development Resources

This section documents candidate AI engineering skills and development resources for pair-programming and agentic workflows in Antigravity. All repository metrics, licenses, and installation steps were verified against source repositories as of November 8, 2026.

### Summary Comparison Matrix

| Resource | Verified GitHub URL | License | Stars (2026-11-08) | Status | Installation Recommendation |
|---|---|---|---|---|---|
| **Gravitas** | https://github.com/udaysharmadev/Gravitas | MIT | 445 | Active (Research preview) | **Recommended (Core mode)** |
| **UI/UX Pro Max** | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT | 146,764 | Active (v2.0) | **Recommended** |
| **Unslop** | https://github.com/heydamir/unslop | CC-BY-4.0 | 11,686 | Active | **Recommended (UI Refinement)** |
| **Digital Accessibility Skill** | https://github.com/Gabriel-Dalton/digital-accessibility-skill | MIT | 0 (New/Snapshot) | Active snapshot | **Recommended (High Priority)** |
| **Addy Osmani Agent Skills** | https://github.com/addyosmani/agent-skills | MIT | 114,020 | Active | **Recommended (Selective)** |

---

### 1. Gravitas

* **GitHub URL:** https://github.com/udaysharmadev/Gravitas
* **Purpose:** An open-source reliability runtime for AI coding agents designed to give models Claude-grade engineering discipline (read before writing, plan in proportion to risk, verify against executed evidence, and report only what evidence supports).
* **Main Capabilities:**
  * Enforces six core invariants:
    1. *Ground before mutating:* Reads target files, tests, and callers before editing.
    2. *Stay in declared scope:* Enforces an explicit `allowed_write_scope`; outside writes are rejected.
    3. *Completion needs evidence:* Demands fresh validator test executions (with output hashes and exit codes) run *after* the final code mutation.
    4. *Never exact-retry a failure:* Prevents repeating byte-identical failing tool calls.
    5. *Satisfy the contract:* Acceptance criteria and validators strictly gate task completion.
    6. *Say what you cannot verify:* Disallows false certainty; unbacked claims are tagged as unverified.
  * Adaptive planning engine emitting machine-readable plans (`direct`, `compact`, `deep`, `replan`) with explicit cost profiles (`eco`, `balanced`, `deep`, `team`).
  * Hook-based gating preventing agent sessions from closing without passing verifiable test runs.
* **Installation Instructions for Antigravity:**
  * *Option A: Core Mode (Recommended):* Portable behavioral policy delivered as an Agent Skill with zero native runtime dependencies:
    ```bash
    npx skills add udaysharmadev/Gravitas --skill gravitas --agent antigravity --yes
    ```
    Alternatively, copy `skills/gravitas/` into `.agents/skills/gravitas/` (project-level) or `~/.gemini/antigravity/skills/gravitas/` (global).
  * *Option B: Native Plugin Mode:* Full Antigravity plugin integrating lifecycle hooks (`PreToolUse`, `PostToolUse`, `PostInvocation`, `Stop`):
    ```bash
    git clone --depth 1 https://github.com/udaysharmadev/Gravitas.git
    cd Gravitas
    bash scripts/build-native-bundle.sh
    agy plugin install "$PWD/dist/gravitas-antigravity"
    agy plugin validate "$PWD/dist/gravitas-antigravity"
    ```
* **Supported Platforms:** Antigravity (core skill + native plugin), OpenCode (`gravitas guard`), Claude Code, Codex, and any runtime conforming to the open Agent Skills specification.
* **License:** MIT License (`spdx_id: MIT`).
* **Maintenance Status:** Actively maintained research preview (regular commits and CI passing up to November 2026).
* **Security Considerations:**
  * The Core skill operates purely within markdown instructions and standard agent tools; it introduces no background daemons, network calls, or credential access.
  * The Native plugin runs local shell hooks on tool calls; hook scripts should be audited prior to running `agy plugin install`.
* **Compatibility Limitations:**
  * Native plugin bundling script (`scripts/build-native-bundle.sh`) requires a Bash environment (e.g. Git Bash on Windows).
  * Marked as "research preview" by author — comparative performance benchmarks are ongoing.
* **Whether We Should Install It:** **Yes (in Core Skill mode)**. It directly addresses the risk of unverified assumptions, hallucinations, and premature "done" claims during autonomous tasks.
* **When We Should Use It in Our Project:** Throughout all coding, data migration, and refactoring phases to enforce test execution before milestone completion.

---

### 2. UI/UX Pro Max Skill

* **GitHub URL:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
* **Purpose:** An AI design intelligence skill providing comprehensive, actionable design systems, accessible color palettes, curated font pairings, and UI reasoning rules across multiple platforms and frameworks.
* **Main Capabilities:**
  * Knowledge base containing 80 searchable UI styles (51 active) and 192 product types.
  * Built-in BM25 search engine script (`search.py`) for matching project domain to optimal design aesthetic.
  * Stack-specific implementation rules for 22 frameworks, including Next.js, React, and Tailwind CSS.
  * Design System Generator (v2.0) that generates cohesive color tokens, typography scales, layout patterns, and elevation styles.
  * Pre-delivery accessibility and polish checklists: WCAG contrast ratio (minimum 4.5:1), visible focus states, `cursor-pointer` on interactives, and `prefers-reduced-motion` compliance.
* **Installation Instructions for Antigravity:**
  * Install via npm/npx CLI:
    ```bash
    npm install -g ui-ux-pro-max-cli
    uipro init --ai antigravity
    ```
    This initializes the skill in `.agents/skills/ui-ux-pro-max/`.
  * Manual installation: Clone or copy the skill directory into `.agents/skills/ui-ux-pro-max/` or `~/.agents/skills/ui-ux-pro-max/`.
* **Supported Platforms:** Antigravity, Claude Code, Cursor, Windsurf, Codex CLI, Continue, Gemini CLI, OpenCode, GitHub Copilot, and others.
* **License:** MIT License (`spdx_id: MIT`).
* **Maintenance Status:** Highly active (v2.0 recently released, frequent updates, extensive multi-language documentation).
* **Security Considerations:**
  * Search script uses standard library Python 3 only; it makes no external network calls and requires no third-party package dependencies.
* **Compatibility Limitations:**
  * Requires local Python 3.x in `PATH` to run the search script (`python3 search.py`).
  * The repository checkout exceeds 200 files; do not attempt to upload the entire repository zip to restricted web interfaces.
* **Whether We Should Install It:** **Yes**. Highly beneficial for establishing an editorial, historical cartographic visual system.
* **When We Should Use It in Our Project:** During UI architecture planning, map interface design, timeline component styling, typography selection (Arabic and Latin combinations), and theme token definition.

---

### 3. Unslop

* **GitHub URL:** https://github.com/heydamir/unslop
* **Purpose:** A design refinement and critique skill created by Damir Sokolovsky that turns generic, "vibecoded", AI-looking interfaces into disciplined, distinctive UIs by eliminating visual cliches and executing methodical design passes.
* **Main Capabilities:**
  * UI Audit: Systematically identifies "slop" (gratuitous purple/blue gradients, glow effects, meaningless emojis as icons, uneven spacing, inconsistent padding, and buzzword copy).
  * Design Direction: Defines clear aesthetic character and intentional focal points derived from the specific product domain.
  * Ordered Refinement Passes: Executes targeted passes in sequence: Spacing → Color → Icons → Copy → Typography → Layout → Details → Visuals → Motion.
  * Preserves underlying tech stack (Next.js, React, Tailwind CSS, plain CSS).
  * Optional story video generation documenting the screen progression (requires Playwright and ffmpeg).
* **Installation Instructions for Antigravity:**
  * Clone and copy the skill into the Antigravity agent skills directory:
    ```bash
    git clone https://github.com/heydamir/unslop.git
    mkdir -p .agents/skills/unslop
    cp -r unslop/skills/unslop/* .agents/skills/unslop/
    ```
    Or copy to the user's global skills directory (`~/.agents/skills/unslop/` or `~/.gemini/antigravity/skills/unslop/`).
* **Supported Platforms:** Claude Code, Codex, Antigravity, and any Agent Skills-compliant runtime.
* **License:** Creative Commons Attribution 4.0 International (`CC-BY-4.0`).
* **Maintenance Status:** Active (ongoing work by Damir Sokolovsky).
* **Security Considerations:**
  * Core skill consists solely of instructions and guidelines; no arbitrary script execution.
  * Optional story video feature relies on Playwright browser automation and ffmpeg; use only if generating video artifacts.
  * **Attribution Requirement:** CC-BY-4.0 requires explicit attribution to Damir Sokolovsky (`@heydamir`) and a link to the repository if materials are adapted or redistributed.
* **Compatibility Limitations:**
  * Story video generation requires local `ffmpeg` on `PATH` and Playwright Chromium installation (`npx playwright install chromium`). These dependencies are entirely optional for the core design audit and refinement workflows.
* **Whether We Should Install It:** **Yes (for UI refinement stages)**. Directly reinforces `docs/PROJECT_OVERVIEW.md` Section 2 ("The experience should feel like a digital historical atlas or museum archive, not a generic SaaS dashboard").
* **When We Should Use It in Our Project:** Whenever new screens, panels, or map overlay widgets are created, to strip out generic AI UI tropes and ensure dignified archival styling.

---

### 4. Digital Accessibility Skill

* **GitHub URL:** https://github.com/Gabriel-Dalton/digital-accessibility-skill
* **Purpose:** A dedicated Agent Skill for auditing, fixing, building, and documenting accessible web UI against WCAG 2.2 (Level A and AA) and governing legal standards (ADA Title II, Section 508, EAA / EN 301 549, UK PSBAR, Accessible Canada Act).
* **Main Capabilities:**
  * Code-level audits of HTML, React, Vue, and Next.js components with explicit mapping to WCAG 2.2 success criteria.
  * Supplies corrected, production-ready code emphasizing semantic HTML elements before reaching for ARIA attributes.
  * Implements accessible interaction patterns from the W3C ARIA Authoring Practices Guide (keyboard navigation, roving focus, focus trapping in modal dialogs, accessible comboboxes).
  * Comprehensive legal and technical reference tables with verified check dates and primary source citations.
  * Generates accessibility statements and VPAT 2.5Rev conformance reports.
  * Internal test suite (`python tests/test_skill.py`) that validates link integrity, WCAG 2.2 criteria matching, and line length constraints.
* **Installation Instructions for Antigravity:**
  * Using the open skills CLI:
    ```bash
    npx skills add Gabriel-Dalton/digital-accessibility-skill
    ```
  * Or manual installation:
    ```bash
    git clone https://github.com/Gabriel-Dalton/digital-accessibility-skill.git
    mkdir -p .agents/skills/digital-accessibility
    cp -r digital-accessibility-skill/digital-accessibility/* .agents/skills/digital-accessibility/
    ```
* **Supported Platforms:** Antigravity, Claude Code, Cursor, Codex, Gemini CLI, and any agent supporting open Agent Skills (`SKILL.md`).
* **License:** MIT License (`spdx_id: MIT`).
* **Maintenance Status:** Active snapshot (verified against primary sources up to September 2026; test suite passes).
* **Security Considerations:**
  * Pure documentation and prompt guidance; executes no external network queries or background processes.
  * Safe for all development environments.
* **Compatibility Limitations:**
  * None for normal skill usage. (Running the test suite `test_skill.py` requires Python 3.x, but the skill itself operates in any LLM context).
* **Whether We Should Install It:** **Yes (High Priority)**. Directly fulfills project requirement `FR-10` ("Responsive and accessible UI") and non-functional accessibility requirements.
* **When We Should Use It in Our Project:** During development of the year slider/timeline controls, territory information modals, map keyboard navigation, and color contrast validation.

---

### 5. Addy Osmani Agent Skills

* **GitHub URL:** https://github.com/addyosmani/agent-skills
* **Purpose:** A curated collection of 25 production-grade engineering skills for AI coding agents, encoding senior software engineering workflows, quality gates, and best practices across the full development lifecycle.
* **Main Capabilities:**
  * Organized across six distinct engineering stages:
    * **Define:** `interview-me` (deep requirements elicitation), `spec-driven-development` (PRD writing before coding), `constraint-driven-development` (establishing enforceable quality bars), `idea-refine`.
    * **Plan:** `planning-and-task-breakdown` (breaking specs into small, verifiable, atomic tasks).
    * **Build:** `incremental-implementation` (thin vertical slices), `test-driven-development` (red-green-refactor cycle, test pyramid), `source-driven-development` (grounding choices in official documentation), `doubt-driven-development` (adversarial review of non-trivial architectural decisions), `frontend-ui-engineering`, `api-and-interface-design`.
    * **Verify:** `browser-testing-with-devtools`, `debugging-and-error-recovery` (systematic reproduce → localize → reduce → fix → guard cycle).
    * **Review:** `code-review-and-quality` (5-axis review, ~100-line change sizing), `code-simplification` (Chesterton's fence, Rule of 500), `security-and-hardening` (OWASP Top 10, boundary validation), `performance-optimization`.
    * **Ship:** `git-workflow-and-versioning` (atomic commits, trunk-based patterns), `ci-cd-and-automation`.
* **Installation Instructions for Antigravity:**
  * Install the full suite via skills CLI:
    ```bash
    npx skills add addyosmani/agent-skills
    ```
  * Or install specific individual skills:
    ```bash
    npx skills add addyosmani/agent-skills --skill test-driven-development
    npx skills add addyosmani/agent-skills --skill incremental-implementation
    npx skills add addyosmani/agent-skills --skill code-review-and-quality
    ```
  * Manual installation: Clone repository and copy selected skill folders from `skills/<skill-name>` into `.agents/skills/<skill-name>`.
  * *Portability Note (Issue #361):* Single-skill `npx` installs copy only `skills/<name>/` without the repo-level `references/` directory. For skills with supplementary checklists, either clone the repo or copy the needed checklist into the installed skill folder.
* **Supported Platforms:** Antigravity, Claude Code, Cursor, Codex, OpenCode, Gemini CLI, Kiro, Command Code, and others.
* **License:** MIT License (`spdx_id: MIT`).
* **Maintenance Status:** Highly active (frequent contributions, high community adoption).
* **Security Considerations:**
  * Skills consist of structured markdown instructions (`SKILL.md`); no untrusted scripts or network daemons.
  * Follow standard token context hygiene when loading multiple skills simultaneously.
* **Compatibility Limitations:**
  * Installing all 25 skills concurrently in a single project can saturate agent context and induce rule fatigue. It is strongly recommended to install only the 3–4 skills pertinent to the current milestone.
* **Whether We Should Install It:** **Yes (Selective Installation)**. Adopt targeted high-impact skills rather than the entire 25-skill bundle.
* **When We Should Use It in Our Project:**
  * Use `test-driven-development` and `incremental-implementation` during feature building.
  * Use `code-review-and-quality` and `security-and-hardening` before merging feature branches and releasing API routes.

---

### Verification and Evidentiary Standards

In accordance with our engineering policy:
* **Verified Information:** Star counts, licenses (MIT, CC-BY-4.0), repository URLs, author names, CLI commands, and directory layouts were verified by directly inspecting the live GitHub repositories and their official `README.md` and license files on November 8, 2026.
* **Evaluations & Recommendations:** Judgments regarding whether and when to install each skill are engineering recommendations based on the project requirements outlined in `REQUIREMENTS.md` and `PROJECT_OVERVIEW.md`. No installation will occur without explicit user approval.

