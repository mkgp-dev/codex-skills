import { readFile } from "node:fs/promises";

const ISSUE_TITLE = "Library version updates";
const ISSUE_MARKER = "<!-- codex-skills:library-update-tracker -->";
const TRACKED_LIBRARIES_FILE =
  process.env.LIBRARY_CHECKER_TRACKED_FILE ?? "libraries.json";
const NPM_REGISTRY_URL =
  process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";
const GITHUB_API_URL =
  process.env.GITHUB_API_URL ?? "https://api.github.com";
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DRY_RUN = process.env.LIBRARY_CHECKER_DRY_RUN === "1";
const MOCK_NPM_VERSIONS = parseJsonEnv("LIBRARY_CHECKER_MOCK_NPM_VERSIONS");
const MOCK_GITHUB_ISSUES = parseJsonEnv("LIBRARY_CHECKER_MOCK_GITHUB_ISSUES");

async function main() {
  const trackedLibraries = await readTrackedLibraries(TRACKED_LIBRARIES_FILE);
  const packages = Object.entries(trackedLibraries);

  if (packages.length === 0) {
    throw new Error("libraries.json must contain at least one package.");
  }

  const results = await Promise.all(
    packages.map(async ([packageName, trackedVersion]) => {
      const latestVersion = await fetchLatestVersion(packageName);
      const updateType = classifyUpdate(trackedVersion, latestVersion);

      return {
        packageName,
        trackedVersion: normalizeVersion(trackedVersion),
        latestVersion: normalizeVersion(latestVersion),
        updateType,
      };
    }),
  );

  const outdatedLibraries = results
    .filter((result) => result.updateType !== "none")
    .sort((left, right) => left.packageName.localeCompare(right.packageName));

  console.log(JSON.stringify({ outdatedLibraries }, null, 2));

  const issueBody = buildIssueBody(outdatedLibraries);
  await syncTrackingIssue({ outdatedLibraries, issueBody });
}

async function readTrackedLibraries(filePath) {
  const content = await readFile(filePath, "utf8");
  const parsed = JSON.parse(content);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("libraries.json must be an object.");
  }

  return parsed;
}

async function fetchLatestVersion(packageName) {
  if (
    MOCK_NPM_VERSIONS &&
    Object.prototype.hasOwnProperty.call(MOCK_NPM_VERSIONS, packageName)
  ) {
    return MOCK_NPM_VERSIONS[packageName];
  }

  const url = `${NPM_REGISTRY_URL.replace(/\/$/, "")}/${encodeURIComponent(packageName)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "codex-skills-library-checker",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${packageName} from npm: ${response.status} ${response.statusText}`,
    );
  }

  const metadata = await response.json();
  const latestVersion = metadata?.["dist-tags"]?.latest;

  if (typeof latestVersion !== "string" || latestVersion.length === 0) {
    throw new Error(`Package ${packageName} does not expose a latest dist-tag.`);
  }

  return latestVersion;
}

function buildIssueBody(outdatedLibraries) {
  const generatedAt = new Date().toISOString();

  if (outdatedLibraries.length === 0) {
    return [
      ISSUE_MARKER,
      "# Library version updates",
      "",
      "All tracked libraries are up to date.",
      "",
      `Generated at: \`${generatedAt}\``,
      "",
      `Source of truth: \`${TRACKED_LIBRARIES_FILE}\``,
    ].join("\n");
  }

  const rows = outdatedLibraries.map(
    ({ packageName, trackedVersion, latestVersion, updateType }) =>
      `| \`${packageName}\` | \`${trackedVersion}\` | \`${latestVersion}\` | ${updateType} |`,
  );

  return [
    ISSUE_MARKER,
    "# Library version updates",
    "",
    "The following tracked libraries have newer npm releases available.",
    "",
    "| Package | Tracked | Latest | Update |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    `Generated at: \`${generatedAt}\``,
    "",
    `Source of truth: \`${TRACKED_LIBRARIES_FILE}\``,
  ].join("\n");
}

async function syncTrackingIssue({ outdatedLibraries, issueBody }) {
  const issue = await findTrackingIssue();

  if (outdatedLibraries.length === 0) {
    if (!issue) {
      console.log("No outdated libraries and no existing tracking issue.");
      return;
    }

    await updateIssue(issue.number, {
      body: issueBody,
      state: "closed",
    });
    console.log(`Closed tracking issue #${issue.number}.`);
    return;
  }

  if (!issue) {
    const createdIssue = await createIssue({
      title: ISSUE_TITLE,
      body: issueBody,
    });
    console.log(`Created tracking issue #${createdIssue.number}.`);
    return;
  }

  await updateIssue(issue.number, {
    title: ISSUE_TITLE,
    body: issueBody,
    state: "open",
  });
  console.log(`Updated tracking issue #${issue.number}.`);
}

async function findTrackingIssue() {
  if (DRY_RUN) {
    if (Array.isArray(MOCK_GITHUB_ISSUES)) {
      return (
        MOCK_GITHUB_ISSUES.find((issue) => isTrackingIssue(issue)) ?? null
      );
    }

    return null;
  }

  const issues = await paginateIssues();
  return issues.find((issue) => isTrackingIssue(issue)) ?? null;
}

function isTrackingIssue(issue) {
  if (!issue || issue.pull_request) {
    return false;
  }

  return (
    issue.title === ISSUE_TITLE ||
    String(issue.body ?? "").includes(ISSUE_MARKER)
  );
}

async function paginateIssues() {
  const issues = [];
  let page = 1;

  while (true) {
    const response = await githubRequest(
      `/repos/${GITHUB_REPOSITORY}/issues?state=all&per_page=100&page=${page}`,
      { method: "GET" },
    );

    if (!Array.isArray(response) || response.length === 0) {
      return issues;
    }

    issues.push(...response);
    page += 1;
  }
}

async function createIssue(payload) {
  if (DRY_RUN) {
    return { number: 0, ...payload };
  }

  return githubRequest(`/repos/${GITHUB_REPOSITORY}/issues`, {
    method: "POST",
    body: payload,
  });
}

async function updateIssue(issueNumber, payload) {
  if (DRY_RUN) {
    return { number: issueNumber, ...payload };
  }

  return githubRequest(`/repos/${GITHUB_REPOSITORY}/issues/${issueNumber}`, {
    method: "PATCH",
    body: payload,
  });
}

async function githubRequest(path, options) {
  if (!GITHUB_REPOSITORY) {
    throw new Error("GITHUB_REPOSITORY is required for GitHub issue sync.");
  }

  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is required for GitHub issue sync.");
  }

  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    method: options.method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "codex-skills-library-checker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText} ${errorText}`,
    );
  }

  return response.json();
}

function classifyUpdate(trackedVersion, latestVersion) {
  const tracked = parseSemver(trackedVersion);
  const latest = parseSemver(latestVersion);

  if (compareSemver(tracked, latest) >= 0) {
    return "none";
  }

  if (latest.major > tracked.major) {
    return "major";
  }

  if (latest.minor > tracked.minor) {
    return "minor";
  }

  return "patch";
}

function normalizeVersion(version) {
  return String(version).trim().replace(/^v/, "");
}

function parseSemver(version) {
  const normalizedVersion = normalizeVersion(version);
  const match = normalizedVersion.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/,
  );

  if (!match) {
    throw new Error(`Unsupported semver value: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  };
}

function compareSemver(left, right) {
  if (left.major !== right.major) {
    return left.major - right.major;
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }

  if (left.patch !== right.patch) {
    return left.patch - right.patch;
  }

  if (left.prerelease === right.prerelease) {
    return 0;
  }

  if (left.prerelease === null) {
    return 1;
  }

  if (right.prerelease === null) {
    return -1;
  }

  return left.prerelease.localeCompare(right.prerelease);
}

function parseJsonEnv(name) {
  const raw = process.env[name];

  if (!raw) {
    return null;
  }

  return JSON.parse(raw);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
