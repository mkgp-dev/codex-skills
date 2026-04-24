# Changelog Structure And Sections

Use a stable structure so readers can scan versions quickly and compare releases over time without relearning the format.

## Default Skeleton

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.6.0] - 2026-04-24

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

## Section Defaults

- `Added`: new features or new repository capabilities
- `Changed`: behavior changes, workflow changes, or substantial improvements that are not brand-new features
- `Deprecated`: supported-but-discouraged behavior that will be removed later
- `Removed`: features, interfaces, or support that no longer exist
- `Fixed`: defects that affected correctness, reliability, or usability
- `Security`: security-relevant fixes or hardening worth calling out separately

## Entry Formatting Rules

- Use dated version headers for released versions.
- Keep section headings consistent across releases.
- Write bullets as completed outcomes, not implementation steps.
- Keep bullets short enough to scan, but specific enough to stand alone.
- Use code formatting for identifiers, commands, flags, routes, or skill names when that improves clarity.

## When To Split Versus Combine

- Split bullets when they describe distinct user-visible outcomes.
- Combine bullets when multiple low-level changes produce one meaningful outcome.
- Avoid repeating the same change in multiple sections.

## Good Sectioning

```markdown
### Added
- Added a new CLI command for exporting benchmark summaries.

### Changed
- Simplified the installation flow for experimental skills.

### Fixed
- Fixed broken links in the installation guide.
```

## Weak Sectioning

```markdown
### Changed
- Added export command
- Fixed links
- Updated install
```

The weak version hides change type and makes scanning harder.
