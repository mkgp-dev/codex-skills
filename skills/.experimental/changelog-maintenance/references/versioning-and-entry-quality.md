# Versioning And Entry Quality

Use semantic versioning as the release frame, but do not guess version bumps carelessly. Align the changelog with the real compatibility impact of the work.

## SemVer Alignment

- `MAJOR`: breaking changes, removed interfaces, incompatible behavior shifts
- `MINOR`: backward-compatible features or meaningful new capabilities
- `PATCH`: backward-compatible fixes, corrections, or small improvements

If the user does not explicitly ask you to choose a version bump, you may explain the likely bump implied by the work, but do not present guesswork as confirmed release policy.

## High-Signal Entry Rules

Prefer bullets that answer at least one of these questions:

- What new capability exists now?
- What behavior changed in a way users or maintainers will notice?
- What bug was fixed?
- What compatibility, migration, or security impact exists?

## Weak Versus Strong Wording

Weak:

- Improved things
- Various fixes
- Updated codebase
- Refactored internals

Stronger:

- Improved installation instructions for experimental skills.
- Fixed the install command for the `changelog-maintenance` skill.
- Added a tracked `CHANGELOG.md` for release history.

## What Usually Does Not Belong

Exclude by default:

- routine test-only additions
- pure refactors with no outward impact
- formatting-only changes
- typo fixes with no meaningful documentation impact
- internal renames with no user, maintainer, or integrator relevance

Include them only when the repository’s audience would care or when they materially affect workflows, diagnostics, compatibility, or maintenance.

## Quality Check

Each version entry should feel:

- complete enough to trust
- selective enough to read
- specific enough to understand later
- consistent enough to compare across releases
