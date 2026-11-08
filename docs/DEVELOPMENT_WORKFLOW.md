# Development Workflow

## 1. Working principle

For each stage, follow:

**Inspect → Plan → Implement → Test → Review → Document → Commit → Push**

Do not generate the entire application from one large prompt. Complete one small, verifiable milestone at a time.

## 2. Repository and branch strategy

Keep `main` stable. Use `develop` as the integration branch if the project workflow remains manageable. Create short-lived feature branches from `develop`.

Suggested branches:
- `develop`
- `feature/project-scaffold`
- `feature/database-foundation`
- `feature/historical-data-model`
- `feature/map-prototype`
- `feature/year-timeline`
- `feature/dynasty-pages`

Do not create all branches in advance. Create a feature branch when that task is ready.

## 3. Feature Branch, Testing and Merge Policy

For solo development assisted by AI agents, adhere to a strict, disciplined Git flow to guarantee stability, auditability, and clean history:

### 1. Pre-Task Alignment & Approval Gate
- **Stop before coding changes, and wait for approval.**
- Always inspect existing code, schemas, and documentation first.
- Present a concrete, minimal task plan detailing the files to be touched and expected changes.
- Never write application code, install packages, or modify schemas until the user explicitly reviews and approves the plan.

### 2. Create a Feature Branch
- Never commit work directly to `main` or unstructured branches.
- Branch off from the latest `develop`:
  ```bash
  git switch develop
  git pull origin develop
  git switch -c feature/<short-task-name>
  ```
- Keep the scope strictly limited to one objective or milestone.

### 3. Implement in Scoped Slices
- Maintain a narrow write scope (`allowed_write_scope`). Do not touch unrelated files or refactor components outside the agreed plan.
- Ground all modifications: inspect target files and tests prior to editing.

### 4. Review Diffs Systematically
- Inspect full diffs before staging:
  ```bash
  git status
  git diff --check
  git diff
  ```
- Ensure no accidental whitespace errors, leftover debug statements, secrets, or temporary artifacts are present.

### 5. Run Verification Tests & Capture Evidence
- Execute every relevant validator on the system before committing:
  - Lint checks (`npm run lint` / linter CLI)
  - Type checks (`npm run type-check` or `tsc --noEmit`)
  - Unit/integration tests (`npm test` / Vitest)
  - Production build verification (`npm run build`)
- **Evidence Rule:** Never claim tests passed without running the command and inspecting the output. Record command names and exit statuses.

### 6. Commit & Push
- Stage only verified files:
  ```bash
  git add <specific-files>
  git commit -m "feat(<scope>): concise description of verified change"
  git push -u origin feature/<short-task-name>
  ```

### 7. Clean Merge Policy
- Merge to `develop` only when the feature branch is completely clean:
  - All automated checks pass with zero warnings or errors.
  - Manual review confirms responsive UI, keyboard accessibility, and adherence to historical data policy.
  - Documentation (`PROGRESS.md`, `CHANGELOG.md`, ADRs) is updated to reflect the change.
- Merge via PR or clean fast-forward/squash merge, and delete the feature branch once integrated.
- Only promote `develop` to `main` for verified, stable release milestones.

## 4. Initial Git setup

First confirm whether the GitHub repository is empty. If it already contains a README or license, clone it rather than creating a separate Git history.

For an empty repository, in the local project folder:

```bash
git init
git branch -M main
# Add the initial documentation files.
git add README.md docs/
git commit -m "docs: add project foundation"
git remote add origin https://github.com/Usmankhalid20/islamic-history-atlas.git
git push -u origin main
```

Then create the integration branch:

```bash
git switch -c develop
git push -u origin develop
```

For future work:

```bash
git switch develop
git pull origin develop
git switch -c feature/short-task-name
```

After implementation and tests:

```bash
git status
git diff --check
git diff
git add .
git commit -m "feat: describe the completed change"
git push -u origin feature/short-task-name
```

Merge through a pull request when possible. Do not force-push shared branches. Do not commit secrets, `.env` files, build output, or dependency folders.

## 5. Antigravity Task Instructions & AI Skills Integration

At the start of each task, the coding agent must:
1. **Inspect:** Read repository tree, schemas, and relevant existing files before taking action.
2. **Contextualize:** Consult project documentation (`README.md`, `REQUIREMENTS.md`, `ENGINEERING_RULES.md`).
3. **Plan & Declare Scope:** Report existing patterns, state the smallest implementation plan, and explicitly declare the target file scope (`allowed_write_scope`).
4. **Approval Gate:** **Stop before coding changes, and wait for explicit user approval.** Never install dependencies, alter schemas, or mutate code without confirmation.

### Integration with Researched AI Skills
When authorized by the user, the agent integrates verified open-source engineering skills documented in [`docs/RESEARCHED_RESOURCES.md`](RESEARCHED_RESOURCES.md):
- **Gravitas Invariants:** Ground every edit before mutating; never retry byte-identical failing calls; enforce the completion gate requiring freshly executed test evidence.
- **Addy Osmani Skills:** Use `planning-and-task-breakdown` during task specification; apply `test-driven-development` and `incremental-implementation` during code execution; run `code-review-and-quality` prior to merge.
- **UI/UX Pro Max:** Reference design tokens, editorial museum palettes, typography pairings, and layout patterns for cartographic interfaces.
- **Unslop:** Execute systematic refinement passes (spacing, typography, color restraint) on UI features to prevent generic AI interface tropes.
- **Digital Accessibility Skill:** Audit and build components against WCAG 2.2 AA standards (keyboard navigation, visible focus indicators, color contrast, and `prefers-reduced-motion`).

After implementation, the agent must require:
1. A concise summary of files changed and the architectural rationale.
2. Real executed test, build, and type-check commands with verified exit codes and output snippets.
3. Known limitations, risks, or remaining assumptions.
4. Updates to documentation (`PROGRESS.md`, `CHANGELOG.md`, ADRs).
5. A proposed conventional commit message.

**Never accept a claim that tests passed unless the commands were actually executed and their results inspected.**

## 6. Code Quality Rules

See [`docs/ENGINEERING_RULES.md`](ENGINEERING_RULES.md) for the complete, binding engineering constraints. Key baseline rules include:
- Reuse existing components, schemas, and utilities before creating new ones.
- Avoid duplicate components, helpers, API routes, and dependencies.
- Keep functions focused and names explicit.
- Do not add a package for a feature that can be implemented cleanly with the existing stack.
- Avoid premature abstractions and overengineering.
- Keep business logic separate from map rendering and UI components.
- Add tests for date filtering and historical-data interpretation rules.
- Do not silently change public API contracts or database schemas.

## 7. Documentation Maintenance

Update:
- `PROGRESS.md` after every milestone.
- `DECISIONS.md` when a meaningful technical choice is made.
- `CHANGELOG.md` for notable user-facing changes.
- Relevant architecture/API/data docs when behavior changes.

Each progress entry should say what was completed, files changed, checks run, blockers, and the next step.
