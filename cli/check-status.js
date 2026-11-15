// @ts-check
import * as fs from "node:fs";
import path from "node:path";
import { getFrameworks, getFrameworkVersionString } from "./helpers/frameworks.js";

const RESULTS_FILE = path.join("webdriver-ts", "results.json");
/** A benchmark counts as "good performance" if its factor compared to the best is at most this value */
const GOOD_PERF_THRESHOLD = 1.03;
const MISSING_RESULT = "missing result";

/**
 * @typedef {Object} RepoIdentifier
 * @property {"github" | "gitlab" | "gitee" | "codeberg"} provider
 * @property {string} owner
 * @property {string} repo
 * @property {string} fullPath
 */

/**
 * Parses repository provider, owner, and repository name from a URL.
 * @param {string} urlStr
 * @returns {RepoIdentifier | null}
 */
function parseRepoIdentifier(urlStr) {
  if (!urlStr || typeof urlStr !== "string") return null;
  const trimmed = urlStr.trim();
  try {
    const parsed = new URL(trimmed);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    let provider = null;
    if (parsed.hostname.includes("github.com")) provider = "github";
    else if (parsed.hostname.includes("gitlab.com")) provider = "gitlab";
    else if (parsed.hostname.includes("gitee.com")) provider = "gitee";
    else if (parsed.hostname.includes("codeberg.org")) provider = "codeberg";

    if (!provider) return null;

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    const fullPath = parts.map((p) => p.replace(/\.git$/, "")).join("/");

    return {
      provider: /** @type {"github" | "gitlab" | "gitee" | "codeberg"} */ (provider),
      owner,
      repo,
      fullPath,
    };
  } catch {
    const match = trimmed.match(/(github\.com|gitlab\.com|gitee\.com|codeberg\.org)[/:]([^/]+)\/([^/#?]+)/);
    if (match) {
      let provider = "github";
      if (match[1].includes("gitlab")) provider = "gitlab";
      else if (match[1].includes("gitee")) provider = "gitee";
      else if (match[1].includes("codeberg")) provider = "codeberg";

      const owner = match[2];
      const repo = match[3].replace(/\.git$/, "");
      return {
        provider: /** @type {"github" | "gitlab" | "gitee" | "codeberg"} */ (provider),
        owner,
        repo,
        fullPath: `${owner}/${repo}`,
      };
    }
  }
  return null;
}

/**
 * Calculates days between an ISO timestamp and now.
 * @param {string} isoDate
 * @returns {number}
 */
function daysSince(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Fetches repository metadata and latest issue across GitHub, GitLab, Gitee, and Codeberg with caching.
 */
class RepoClient {
  constructor() {
    /** @type {Map<string, any>} */
    this.repoCache = new Map();
    /** @type {Record<string, string>} */
    this.githubHeaders = {
      "User-Agent": "js-framework-benchmark-checker",
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      this.githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    /** @type {Record<string, string>} */
    this.commonHeaders = {
      "User-Agent": "js-framework-benchmark-checker",
      Accept: "application/json",
    };
  }

  /**
   * @param {RepoIdentifier} repoId
   */
  async getRepoInfo(repoId) {
    const key = `${repoId.provider}:${repoId.fullPath.toLowerCase()}`;
    if (this.repoCache.has(key)) {
      return this.repoCache.get(key);
    }

    /** @type {{ stars: string | number, daysSinceCommit: string | number, daysSinceIssue: string | number, archived: boolean | string }} */
    let result = { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };

    if (repoId.provider === "github") {
      result = await this.getGithubInfo(repoId.owner, repoId.repo, key);
    } else if (repoId.provider === "gitlab") {
      result = await this.getGitlabInfo(repoId.fullPath, key);
    } else if (repoId.provider === "gitee") {
      result = await this.getGiteeInfo(repoId.owner, repoId.repo, key);
    } else if (repoId.provider === "codeberg") {
      result = await this.getCodebergInfo(repoId.owner, repoId.repo, key);
    }

    this.repoCache.set(key, result);
    return result;
  }

  /**
   * @param {string} owner
   * @param {string} repo
   * @param {string} key
   */
  async getGithubInfo(owner, repo, key) {
    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: this.githubHeaders,
      });

      if (!repoRes.ok) {
        console.warn(`[GitHub API] Failed to fetch repo ${key}: HTTP ${repoRes.status}`);
        return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
      }

      const repoData = await repoRes.json();
      const stars = repoData.stargazers_count ?? "N/A";
      const daysSinceCommit = repoData.pushed_at ? daysSince(repoData.pushed_at) : "N/A";
      const archived = repoData.archived ?? "N/A";

      let daysSinceIssue = "N/A";
      if (repoData.has_issues === false) {
        daysSinceIssue = "N/A";
      } else {
        const issuesRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues?state=all&sort=created&direction=desc&per_page=1`,
          { headers: this.githubHeaders }
        );

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          if (Array.isArray(issuesData) && issuesData.length > 0 && issuesData[0].created_at) {
            daysSinceIssue = String(daysSince(issuesData[0].created_at));
          } else {
            daysSinceIssue = "N/A";
          }
        }
      }

      return { stars, daysSinceCommit, daysSinceIssue, archived };
    } catch (error) {
      console.warn(`[GitHub API] Error fetching ${key}:`, error);
      return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
    }
  }

  /**
   * @param {string} fullPath
   * @param {string} key
   */
  async getGitlabInfo(fullPath, key) {
    try {
      const projectPath = encodeURIComponent(fullPath);
      const projectRes = await fetch(`https://gitlab.com/api/v4/projects/${projectPath}`, {
        headers: this.commonHeaders,
      });

      if (!projectRes.ok) {
        console.warn(`[GitLab API] Failed to fetch repo ${key}: HTTP ${projectRes.status}`);
        return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
      }

      const projectData = await projectRes.json();
      const stars = projectData.star_count ?? "N/A";
      const daysSinceCommit = projectData.last_activity_at ? daysSince(projectData.last_activity_at) : "N/A";
      const archived = projectData.archived ?? "N/A";

      let daysSinceIssue = "N/A";
      if (projectData.issues_enabled === false) {
        daysSinceIssue = "N/A";
      } else {
        const issuesRes = await fetch(
          `https://gitlab.com/api/v4/projects/${projectPath}/issues?order_by=created_at&sort=desc&per_page=1`,
          { headers: this.commonHeaders }
        );

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          if (Array.isArray(issuesData) && issuesData.length > 0 && issuesData[0].created_at) {
            daysSinceIssue = String(daysSince(issuesData[0].created_at));
          } else {
            daysSinceIssue = "N/A";
          }
        }
      }

      return { stars, daysSinceCommit, daysSinceIssue, archived };
    } catch (error) {
      console.warn(`[GitLab API] Error fetching ${key}:`, error);
      return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
    }
  }

  /**
   * @param {string} owner
   * @param {string} repo
   * @param {string} key
   */
  async getGiteeInfo(owner, repo, key) {
    try {
      const repoRes = await fetch(`https://gitee.com/api/v5/repos/${owner}/${repo}`, {
        headers: this.commonHeaders,
      });

      if (!repoRes.ok) {
        console.warn(`[Gitee API] Failed to fetch repo ${key}: HTTP ${repoRes.status}`);
        return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
      }

      const repoData = await repoRes.json();
      const stars = repoData.stargazers_count ?? "N/A";
      const daysSinceCommit = repoData.pushed_at ? daysSince(repoData.pushed_at) : "N/A";
      const archived = repoData.archived ?? "N/A";

      let daysSinceIssue = "N/A";
      if (repoData.has_issues === false) {
        daysSinceIssue = "N/A";
      } else {
        const issuesRes = await fetch(
          `https://gitee.com/api/v5/repos/${owner}/${repo}/issues?sort=created&direction=desc&per_page=1`,
          { headers: this.commonHeaders }
        );

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          if (Array.isArray(issuesData) && issuesData.length > 0 && issuesData[0].created_at) {
            daysSinceIssue = String(daysSince(issuesData[0].created_at));
          } else {
            daysSinceIssue = "N/A";
          }
        }
      }

      return { stars, daysSinceCommit, daysSinceIssue, archived };
    } catch (error) {
      console.warn(`[Gitee API] Error fetching ${key}:`, error);
      return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
    }
  }

  /**
   * Codeberg runs Forgejo, whose API v1 is Gitea-compatible. It has no pushed_at, so the last commit is read from the commits endpoint.
   * @param {string} owner
   * @param {string} repo
   * @param {string} key
   */
  async getCodebergInfo(owner, repo, key) {
    try {
      const baseUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}`;
      const repoRes = await fetch(baseUrl, { headers: this.commonHeaders });

      if (!repoRes.ok) {
        console.warn(`[Codeberg API] Failed to fetch repo ${key}: HTTP ${repoRes.status}`);
        return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
      }

      const repoData = await repoRes.json();
      const stars = repoData.stars_count ?? "N/A";
      const archived = repoData.archived ?? "N/A";

      let daysSinceCommit = "N/A";
      const commitsRes = await fetch(`${baseUrl}/commits?limit=1&stat=false&verification=false&files=false`, {
        headers: this.commonHeaders,
      });
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        const commitDate = Array.isArray(commitsData) && (commitsData[0]?.commit?.committer?.date ?? commitsData[0]?.created);
        if (commitDate) {
          daysSinceCommit = daysSince(commitDate);
        }
      }

      let daysSinceIssue = "N/A";
      if (repoData.has_issues === false) {
        daysSinceIssue = "N/A";
      } else {
        const issuesRes = await fetch(`${baseUrl}/issues?state=all&limit=1`, { headers: this.commonHeaders });

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          if (Array.isArray(issuesData) && issuesData.length > 0 && issuesData[0].created_at) {
            daysSinceIssue = String(daysSince(issuesData[0].created_at));
          } else {
            daysSinceIssue = "N/A";
          }
        }
      }

      return { stars, daysSinceCommit, daysSinceIssue, archived };
    } catch (error) {
      console.warn(`[Codeberg API] Error fetching ${key}:`, error);
      return { stars: "N/A", daysSinceCommit: "N/A", daysSinceIssue: "N/A", archived: "N/A" };
    }
  }
}

/**
 * Calculates retirement rule (1 - 4) if applicable:
 * 1. Frameworks from archived repos are archived immediately.
 * 2. Frameworks with < 10 stars after 180 days of inactivity.
 * 3. Frameworks with < 100 stars after 365 days of inactivity.
 * 4. All frameworks after 730 days of inactivity.
 * Inactivity is the newer date (minimum days) of last commit or last issue.
 * @param {{ stars: string | number, daysSinceCommit: string | number, daysSinceIssue: string | number, archived: boolean | string }} info
 * @returns {number | string}
 */
function calculateRetire(info) {
  if (info.archived === true || info.archived === "true") {
    return 1;
  }

  const commitDays = typeof info.daysSinceCommit === "number" ? info.daysSinceCommit : parseInt(String(info.daysSinceCommit), 10);
  const issueDays = typeof info.daysSinceIssue === "number" ? info.daysSinceIssue : parseInt(String(info.daysSinceIssue), 10);

  let inactivityDays = null;
  const validCommit = !isNaN(commitDays);
  const validIssue = !isNaN(issueDays);

  if (validCommit && validIssue) {
    inactivityDays = Math.min(commitDays, issueDays);
  } else if (validCommit) {
    inactivityDays = commitDays;
  } else if (validIssue) {
    inactivityDays = issueDays;
  }

  if (inactivityDays === null) {
    return "";
  }

  const starCount = typeof info.stars === "number" ? info.stars : parseInt(String(info.stars), 10);
  const validStars = !isNaN(starCount);

  if (validStars && starCount < 10 && inactivityDays >= 180) {
    return 2;
  }

  if (validStars && starCount < 100 && inactivityDays >= 365) {
    return 3;
  }

  if (inactivityDays >= 730) {
    return 4;
  }

  return "";
}

/**
 * Escapes values for CSV.
 * @param {any} val
 * @returns {string}
 */
function escapeCsvValue(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Builds a CSV row from the given cells.
 * @param {any[]} cells
 * @returns {string}
 */
function toCsvRow(cells) {
  return cells.map(escapeCsvValue).join(",");
}

/**
 * @param {number[]} values
 * @returns {number}
 */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Determines for each framework the benchmarks where it performs within GOOD_PERF_THRESHOLD of the best
 * framework of the same type (keyed / non-keyed). Like the results table it compares the medians,
 * using the total duration for CPU benchmarks.
 * @returns {Map<string, string[]>} benchmark ids per framework name as used in results.json
 */
function loadGoodPerformers() {
  /** @type {Map<string, string[]>} */
  const goodPerformers = new Map();
  if (!fs.existsSync(RESULTS_FILE)) {
    console.warn(`Notice: ${RESULTS_FILE} not found. The good-perf column will be empty.`);
    return goodPerformers;
  }

  /** @type {{framework: string, benchmark: string, values: Record<string, number[]>}[]} */
  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf-8"));

  const entries = results.map(({ framework, benchmark, values }) => ({
    framework,
    benchmark,
    group: `${framework.endsWith("-non-keyed") ? "non-keyed" : "keyed"}/${benchmark}`,
    value: median(values.total ?? values.DEFAULT),
  }));

  /** @type {Map<string, number>} */
  const bestPerGroup = new Map();
  for (const { group, value } of entries) {
    bestPerGroup.set(group, Math.min(bestPerGroup.get(group) ?? Number.POSITIVE_INFINITY, value));
  }

  for (const { framework, benchmark, group, value } of entries) {
    const benchmarks = goodPerformers.get(framework) ?? [];
    if (value / /** @type {number} */ (bestPerGroup.get(group)) <= GOOD_PERF_THRESHOLD) {
      benchmarks.push(benchmark);
    }
    goodPerformers.set(framework, benchmarks);
  }

  for (const benchmarks of goodPerformers.values()) benchmarks.sort();
  return goodPerformers;
}

/**
 * @param {Object} [options]
 * @param {string[]} [options.types]
 * @param {string} [options.output]
 */
export async function checkStatus(options = {}) {
  const types = options.types || ["keyed", "non-keyed"];
  const outputFile = options.output || "status.csv";
  const frameworks = getFrameworks("frameworks", types);
  const client = new RepoClient();
  const goodPerformers = loadGoodPerformers();

  if (!process.env.GITHUB_TOKEN) {
    console.warn("Notice: GITHUB_TOKEN environment variable not set. Requests will be unauthenticated and subject to lower rate limits.");
  }

  console.log(`Checking status for ${frameworks.length} frameworks...`);

  const csvRows = [
    toCsvRow(["Framework-Name", "Repo URL", "Stars", "Days Since Last Commit", "Days Since Last Issue", "Archived", "Retire?", "good-perf"]),
  ];

  for (let i = 0; i < frameworks.length; i++) {
    const { type, name } = frameworks[i];
    const frameworkName = `${type}/${name}`;
    const frameworkDir = path.join("frameworks", type, name);
    const pkgPath = path.join(frameworkDir, "package.json");

    process.stdout.write(`[${i + 1}/${frameworks.length}] Checking ${frameworkName}... `);

    /**
     * Adds a row for a framework whose repository couldn't be checked.
     * @param {string} reason - shown in the Repo URL column
     * @param {string} goodPerf
     */
    const pushUncheckedRow = (reason, goodPerf) =>
      csvRows.push(toCsvRow([frameworkName, reason, "N/A", "N/A", "N/A", "N/A", "", goodPerf]));

    if (!fs.existsSync(pkgPath)) {
      pushUncheckedRow("no package.json", MISSING_RESULT);
      console.log("no package.json");
      continue;
    }

    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    } catch {
      pushUncheckedRow("invalid package.json", MISSING_RESULT);
      console.log("invalid package.json");
      continue;
    }

    const resultName = getFrameworkVersionString(type, name, pkg);
    const goodPerf = (resultName && goodPerformers.get(resultName)?.join(",")) ?? MISSING_RESULT;

    const meta = pkg["js-framework-benchmark"] || {};
    const repoUrl = meta.repoURL || meta.githubURL || meta.gitlabURL || meta.giteeURL || meta.codebergURL;

    if (!repoUrl) {
      pushUncheckedRow("no repo url", goodPerf);
      console.log("no repo url");
      continue;
    }

    const repoInfo = parseRepoIdentifier(repoUrl);
    if (!repoInfo) {
      pushUncheckedRow(repoUrl, goodPerf);
      console.log(`invalid repo url format (${repoUrl})`);
      continue;
    }

    const { stars, daysSinceCommit, daysSinceIssue, archived } = await client.getRepoInfo(repoInfo);
    const retire = calculateRetire({ stars, daysSinceCommit, daysSinceIssue, archived });

    csvRows.push(toCsvRow([frameworkName, repoUrl, stars, daysSinceCommit, daysSinceIssue, archived, retire, goodPerf]));
    console.log(
      `[${repoInfo.provider}] stars: ${stars}, commit: ${daysSinceCommit}d ago, issue: ${daysSinceIssue}d ago, archived: ${archived}, retire: ${retire || "-"}` +
        (goodPerf ? `, good-perf: ${goodPerf}` : "")
    );
  }

  fs.writeFileSync(outputFile, csvRows.join("\n") + "\n", "utf-8");
  console.log(`\nStatus report saved to ${path.resolve(outputFile)}`);
}

