# codex-skills

A repository for building, refining, and organizing reusable Codex skills.

## Overview

This project is designed to grow into a maintainable collection of high-quality skills that can be authored, improved, benchmarked, and categorized over time. The repository currently uses a simple structure with curated and experimental skill.

## Available Skills

### Curated

| Skill | Description |
| --- | --- |
| None yet | No curated skills are currently tracked in this repository. |

### Experimental

| Skill | Description |
| --- | --- |
| [zod-best-practices](skills/.experimental/zod-best-practices/) | Core Zod schema design, validation, migration, and review guidance for TypeScript applications. |

## Install Skills

This repository can be consumed with the Vercel `skills` CLI.

### List available skills

```bash
npx skills add mkgp-dev/codex-skills --list
```

This lists the skills available in this repository without installing them.

### Install with options

```bash
npx skills add mkgp-dev/codex-skills --skill zod-best-practices
```

### Install a specific skill for Codex

```bash
npx skills add mkgp-dev/codex-skills --skill zod-best-practices -a codex
```

### Install to your global skills directory

```bash
npx skills add mkgp-dev/codex-skills --skill zod-best-practices -a codex -g
```

## License

This repository is licensed under the MIT License. See [LICENSE](./LICENSE).
