# Noise Filtering And Examples

The goal is not to preserve every implementation detail. The goal is to preserve the notable history of the project.

## Filtering Heuristic

Keep changes that are:

- user-facing
- contributor-facing in a meaningful way
- release-relevant
- migration-relevant
- compatibility-relevant
- security-relevant

Drop or compress changes that are:

- repetitive
- purely internal
- already implied by a more useful summary bullet
- too low-level to matter outside the diff

## Rewrite Pattern

Start with raw material:

```text
- feat: add changelog skill
- docs: update readme
- docs: add install command
- chore: reorganize headings
- fix: changelog file was not tracked
```

Rewrite into a changelog entry:

```markdown
### Added
- Added the experimental `changelog-maintenance` skill for changelog-writing best practices.

### Changed
- Updated the repository documentation to include discovery and installation guidance for the new skill.

### Fixed
- Started tracking the root `CHANGELOG.md` in version control.
```

## Changelog Versus Release Notes

Changelog:

- stable repository history
- concise, versioned, and factual
- optimized for maintainability

Release notes:

- broader announcement copy
- may include screenshots, onboarding copy, and audience-specific framing
- optimized for communication and adoption

If the input drifts into release-note language, compress it back into changelog-quality bullets unless the user explicitly wants both outputs.
