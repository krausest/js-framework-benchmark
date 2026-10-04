---
name: review-pr
description: Statically review js-framework-benchmark implementation PRs for allowed file scope, prohibited package scripts, library provenance, supply-chain risk and benchmark-specific optimization notes. Use when asked to review or validate a PR in this repository.
---

# Review PR

## Checkout PR branch

Create an integration-review branch containing the PR applied to its actual GitHub base branch. This reviews the result that would be integrated, not only the isolated PR head. Use the GitHub-style checkout (not `gh pr checkout`). 

0. Before an SSH Git operation, run `ssh-add -l`. If it lists a key, perform the Git operation and request permission to access the SSH-agent socket or network when required. If no agent or identity is available, stop and ask the user to unlock the key with `ssh-add` in their interactive terminal. Never request or transmit the SSH passphrase through chat.
1. Look up the PR base, base commit, head branch, and fork (replace `{number}`):
   ```bash
   gh pr view {number} --json baseRefName,baseRefOid,headRefName,headRepository,headRepositoryOwner \
     -q '"\(.baseRefName) \(.baseRefOid) \(.headRepositoryOwner.login) \(.headRepository.name) \(.headRefName)"'
   ```
   Example output: `master 0123456789abcdef hangtiancheng js-framework-benchmark feat/lark-mvc`

   Use `headRepositoryOwner.login` — not `headRepository.owner.login` (that field is null for fork PRs).
2. Protect the user's working state before switching branches:
   ```bash
   git status --short --branch
   git worktree list
   ```
   Untracked files are acceptable and must not stop the review. Do not stash, remove, clean, or otherwise modify them; proceed unless Git itself rejects a checkout because of an actual path collision. A local branch being ahead of its remote is also acceptable and is not a dirty-worktree condition. If the worktree contains staged or unstaged changes to tracked files that could be affected by checkout, do not switch branches, stash, reset, or discard anything. Stop the review and report the tracked changes.
3. Check out the PR's `{base-ref}` and determine its relationship to `{base-oid}`:
   ```bash
   git checkout {base-ref}
   git rev-parse HEAD
   ```
   Do not describe the base as up to date merely because checkout succeeded. If `HEAD` equals `{base-oid}`, continue. If it differs, first check whether the exact GitHub base commit is already an ancestor of the local branch:
   ```bash
   git merge-base --is-ancestor {base-oid} HEAD
   ```
   A successful ancestor check means the local branch is ahead of the GitHub base. This is expected and acceptable; do not pull, reset, or otherwise modify the local base branch. If the ancestor check fails because the local branch is behind, update it with a fast-forward-only pull and verify `HEAD` again:
   ```bash
   git pull --ff-only origin {base-ref}
   git rev-parse HEAD
   ```
   After the pull, `HEAD` must equal `{base-oid}` or contain `{base-oid}` as an ancestor. If pulling or validation fails, stop the review and report the failure. In all accepted cases, use the exact `{base-oid}`, not the possibly-ahead local `{base-ref}`, as the review branch starting point.
4. Use `merge-pr-{number}` as `{review-branch}` when that name is unused. If it already exists stop the review and report an error. Create the review branch from the verified base:
   ```bash
   git checkout -b {review-branch} {base-oid}
   ```
5. Pull the PR head into the integration-review branch without rebasing or opening an editor:
   ```bash
   git pull --no-rebase --no-edit git@github.com:{fork-owner}/{fork-repo}.git {head-ref}
   ```
   If the merge conflicts, report the conflicting files and stop the review.
6. Verify the resulting state:
   ```bash
   git branch --show-current
   git status --short --branch
   ```
   The current branch must be `{review-branch}` and the pull must have completed without unresolved conflicts.

**Important:**
- Do **not** use `gh pr checkout` or HTTPS `git fetch` workarounds for checkout.

After checkout, continue with the review steps below.

## Static-only constraint

This is a static review. Do not execute code from the PR or its dependencies, and do not perform runtime or dynamic validation.

- Do not run package installation commands such as `npm install`, `npm ci`, or equivalents.
- Do not run package scripts, builds, linters that load project code, test suites, benchmark harnesses, development or production servers, or framework CLIs.
- Do not launch a browser or use browser automation, including custom substitutes for the repository's validation tools.
- Do not execute generated bundles or imported project modules.

Allowed checks are read-only inspection of PR metadata, Git history and diffs, source files, manifests, and lockfiles; static text or structured-data queries; registry and repository metadata lookups; and Git diff hygiene checks such as `git diff --check`. Do not treat omitted dynamic validation as an incomplete check or warning. Leave runtime validation to the maintainer through the `Next step` command in the final report.

## Review steps

1. Get the authoritative changed-file list with `gh pr diff {number} --name-only`. Determine every affected implementation root from paths matching `frameworks/keyed/<implementation>/` or `frameworks/non-keyed/<implementation>/`.
2. Check file scope. Implementation PRs may change files inside one or more affected implementation roots. A root `.gitignore` change is an acceptable exception only when it adds or adjusts patterns required by the affected implementation's toolchain. Any other root file or any path under `webdriver-ts/`, `webdriver-ts-results/`, `server/`, or another directory outside `frameworks/` is disallowed unless the user explicitly identifies the PR as cross-cutting. Always report this check as `PASS`, `WARN`, or `FAIL`, list every affected implementation root, and list every exceptional or disallowed path. Stop the reviews on FAIL checks.
3. Inspect the root `package.json` of every affected implementation, plus any other `package.json` added or changed by the PR inside those implementation roots. The exact lifecycle script keys `preinstall` and `postinstall` are prohibited. Report each manifest checked and whether either key is present.
4. Check that the js-framework-benchmark property exists in package.json and contains 
    "frameworkHomeURL", "language" and "repoURL". It may contain a "customURL" and it must contain either "frameworkVersionFromPackage" or "frameworkVersion". If framework is hosted on npm (i.e. most JS frameworks) frameworkVersionFromPackage must be used. 
    Report missing entries as WARN.
    It also may contain a list of notes in the property "issues". You must use this propery in the checks below. 
5. Identify the rendering library from the implementation's imports and dependency declarations. Verify that its package is available from the npm registry and that the project has a corresponding GitHub repository. Prefer registry metadata and the repository itself over only trusting a homepage field in `package.json`. If either source is unavailable or the package-to-repository relationship cannot be confirmed, report a warning and include what was checked.
6. Perform a supply-chain-focused security review of added or changed dependencies and lockfile entries. Check for suspicious or lookalike package names, unexpected registry or Git/file/HTTP dependency sources, repository or publisher metadata mismatches, unexpected lifecycle scripts in newly introduced packages, integrity or resolved-URL anomalies, and unrelated lockfile churn. Suspected malicious packages are inacceptable and require changes. Ordinary dependency vulnerabilities, including severe vulnerabilities, do not matter for this benchmark unless they provide evidence of a supply-chain attack. Dependency version ranges are accepted: do not report them as findings, classify them as warnings, or let them affect any check status or verdict. Report other findings, but do *not* run automatic fixes, bump versions, add packages, or rewrite lockfiles on your own decision.
7. Take a look at the code. There are same cases that should be reported. Here's a list of the issues and the description you should check:
* "Note #1261": This implementation contains client side code to achieve better performance by using manual caching of (virtual) dom nodes.
* "Note #801": Implementation uses explicit event delegation. This note (and it should be regarded as a note, not an issue) marks implementations that use explicit, i.e. manual, event delegation.
The note is somewhat controversial since there are multiple views on it:

It's natural and best practice to use manual event delegation in vanilla js and in frameworks with a low abstraction level
It's the fastest approach for all frameworks
It doesn't show the cost of implicit, i.e. framework provided, event delegation that's typical available for frameworks with a higher level of abstraction. If a framework has such an implicit event delegation this mechanism should be measured in this benchmark. Otherwise we're only comparing vanillajs variations and not the frameworks. (And we already know the performance of vanillajs, so it doesn't add any value.)
Advice: Use whatever fits the idiomatic style of your framework, but please don't over optimize. This note adds a litte pressure to prevent over-optimizations.
* "Note #800": View state on the model. These implementations move the selected state on to each row. While this is a perfectly fine thing to do it changes the nature of the select rows test. Every library would benefit from it, so a note is added to the implementation when it is used.
* "Note #772": Implementation uses manual DOM manipulations. These implementations use direct DOM modification in the end user code. This means specific DOM updating code is written tailored for these specific tests.
Those implementation are expected to perform very close to vanillajs (which consists of manual DOM manipulations).
Updating bindings doesn't count as manual DOM manipulation. The latter 
avoids using the framework to access the DOM and this should be noted
as we're not measuring the frameworks performance in this case.
* "Note #796": Implementation uses explicit requestAnimationFrame calls. (Severity: Code smell / cheating)
There were some discussions whether using requestAnimationFrame in client code is okay, a code smell or cheating.
Applying RAF for selected benchmark operations should be avoided and is considered cheating: see github issues #166 #430
Using RAF for all operations in client code should be okay (that doesn't answer the question whether is's nice) since frameworks are allowed to use RAF under the covers too.
If the notes you found don't match the notes in the js-framework-benchmark.issues  package.json j

Use these detection and reporting criteria:

| Identifier | Report when | Classification and report text |
| --- | --- | --- |
| Note #1261 | End-user client code manually stores and reuses DOM or virtual-DOM nodes to optimize benchmark operations. Ordinary framework-managed reconciliation or references needed for correctness do not trigger it. | Note: `Note #1261: manual caching of (virtual) DOM nodes.` |
| Note #801 | End-user code attaches a shared ancestor handler and manually dispatches based on the event target. Framework-provided implicit delegation does not trigger it. | Note: `Note #801: implementation uses explicit event delegation.` |
| Note #800 | The selected state is stored or copied onto individual row-model objects rather than kept as separate view state. | Note: `Note #800: view state on the model.` |
| Note #772 | End-user code directly creates, replaces, removes, or updates DOM nodes instead of using the framework's rendering/update mechanism. Updating bindings or obtaining a DOM reference alone does not trigger it. | Note: `Note #772: implementation uses manual DOM manipulations.` |
| Note #796 | End-user code explicitly calls `requestAnimationFrame`. Calls applied only to selected benchmark operations are a `FAIL` and should be reported as cheating. Calls consistently wrapping all operations are a `WARN` and should be reported as a code smell. Framework-internal RAF use does not trigger it. | `Note #796: implementation uses explicit requestAnimationFrame calls.` Include whether the use is selective or applies to all operations. |

For each identifier, report the relevant file and line. Do not emit a note when its detection criterion is not met.

## Final report

Report findings first, ordered by severity, with file and line references. If there are no findings, state that explicitly. Also include this report whenever the review process should stop
due to the criterias defined above.
Then include this summary:

```text
File scope: PASS / WARN / FAIL / NOT RUN
Package scripts: PASS / FAIL / NOT RUN
Framework metadata: PASS / WARN / FAIL / NOT RUN
Library availability: PASS / WARN / NOT RUN
Supply-chain review: PASS / WARN / FAIL / NOT RUN
Missing benchmark notes: list identifiers, or "none"
Commands run: list commands and results
Validation mode: STATIC ONLY
Limitations: list incomplete required static checks, or "none"
ERRORS: list the error which lead to the stopping the process if applicable.
Verdict: PASS / PASS WITH WARNINGS / CHANGES REQUIRED
Next step: npm run rebuild list all relevant directories from the PR (e.g. keyed/framework1 non-keyed/framework2)
```

Use `CHANGES REQUIRED` for disallowed file scope, prohibited `preinstall` or `postinstall` scripts, suspected malicious dependencies, selective benchmark-operation RAF usage. Use `PASS WITH WARNINGS` for non-blocking provenance warnings, benchmark notes, all-operation RAF usage, or incomplete required static checks. Use `PASS` when every required static check passed and no warnings apply. Dynamic or runtime validation is outside this skill's scope and must not affect the verdict.

Dependency version ranges alone never produce a finding or warning and never downgrade the verdict.
