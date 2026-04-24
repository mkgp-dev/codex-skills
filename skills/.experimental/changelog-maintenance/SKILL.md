---
name: changelog-maintenance
description: Best-practice guidance for creating, reviewing, and maintaining high-signal `CHANGELOG.md` entries for versioned software projects. Use this skill whenever the user wants to add or rewrite changelog entries, organize release history, turn completed work into structured version notes, decide what belongs in `Added`/`Changed`/`Fixed`/`Deprecated`/`Removed`/`Security`, or improve noisy release notes into maintainable repository changelogs.
---

# Changelog Maintenance

Use this skill to keep changelogs accurate, readable, and worth maintaining over time. Favor concise versioned history over marketing copy, and make sure every entry reflects meaningful completed work.

## Use This Skill When

- Creating a new `CHANGELOG.md` for a versioned repository
- Updating an existing changelog for a release or an `Unreleased` section
- Reviewing weak, vague, or noisy changelog entries
- Converting raw change lists, tickets, PR summaries, or commit groups into changelog entries
- Deciding what belongs in the changelog versus release notes, internal notes, or implementation detail

## Out Of Scope

- Generating full marketing release announcements, blog posts, or app-store copy
- Acting as a git-history parser by default when the user did not provide commits, diffs, or completed work items
- Documenting every internal refactor, test tweak, typo fix, or dependency bump unless it materially affects users, maintainers, or integrators

## Working Style

1. Identify the source material: existing changelog text, completed work list, commits, PR summary, or release scope.
2. Determine the target entry shape: `Unreleased`, a dated version section, or a changelog rewrite.
3. Filter for signal first. Include user-facing, operator-facing, maintainer-relevant, compatibility, security, or migration-impacting changes.
4. Group the kept changes into stable sections such as `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`.
5. Rewrite entries so each bullet is specific, concise, and understandable without reading the diff.
6. Keep changelog language factual. Do not turn it into promotional copy unless the user explicitly wants release notes instead.

## Reference Map

- `references/changelog-structure-and-sections.md`
  - Use for section ordering, version entry templates, and entry formatting defaults.
- `references/versioning-and-entry-quality.md`
  - Use for semantic-versioning alignment, entry quality checks, and deciding whether work deserves a changelog line.
- `references/noise-filtering-and-examples.md`
  - Use for filtering low-value changes, spotting anti-patterns, and rewriting noisy entries into high-signal examples.

## Response Requirements

- Prefer `Keep a Changelog`-style structure unless the repository already uses another explicit format.
- Keep bullets parallel in tone and granularity within a version entry.
- Prefer repository-facing wording over implementation-detail wording.
- Call out breaking changes, removals, deprecations, migrations, and security fixes explicitly.
- If the provided input is ambiguous, make conservative wording choices and say what assumption was made.
- If the user asks for release notes instead of changelog maintenance, explain the distinction and adapt only if they explicitly want broader user-facing copy.

## Core Defaults

- Default sections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Default top-level structure:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.6.0] - 2026-04-24

### Added
- Added a new skill for changelog maintenance best practices.
```

- Prefer one clear bullet over several near-duplicates.
- Prefer concrete outcomes:
  - Good: `Added install instructions for the new changelog-maintenance skill.`
  - Weak: `Improved docs.`
- Keep internal-only noise out unless it changed behavior, compatibility, security, operations, or contributor workflow materially.
- If a change spans multiple areas, place it where a reader is most likely to look first instead of duplicating it across sections.

## Review Checklist

Before finalizing a changelog entry, check that it:

- matches the actual completed work
- uses the correct version and date when releasing
- separates features, fixes, removals, and security items clearly
- avoids vague filler such as `misc updates`, `various fixes`, or `improvements`
- omits trivial churn unless the repository treats that churn as notable
- stays readable when scanned months later without extra context

## Anti-Patterns To Correct

- Dumping raw commit subjects directly into `CHANGELOG.md`
- Mixing changelog bullets with upgrade instructions, screenshots, or promotional language
- Listing every internal maintenance task as if it matters equally to readers
- Hiding breaking changes inside `Changed`
- Using inconsistent tense, scope, or bullet granularity across versions

## Examples

**Example 1: Rewrite a weak entry**

Input:

```markdown
## [1.6.0]
- updated docs
- fixed stuff
- added changelog skill
```

Output:

```markdown
## [1.6.0] - 2026-04-24

### Added
- Added the experimental `changelog-maintenance` skill for creating and reviewing high-signal changelog entries.

### Changed
- Updated repository documentation to include installation and discovery guidance for the new skill.

### Fixed
- Clarified changelog tracking by introducing a dedicated root `CHANGELOG.md`.
```

**Example 2: Filter noise from a work list**

Input:

```text
- feat: add CSV export
- refactor: rename helper functions
- fix: export dialog closes unexpectedly
- test: add export coverage
- docs: update screenshots
```

Output:

```markdown
### Added
- Added CSV export support.

### Fixed
- Fixed an issue where the export dialog could close unexpectedly.
```

Keep the refactor, tests, and screenshot-only docs update out unless the repository explicitly treats them as notable.
