Here are the instructions how to review, build and run PRs.
I'll give you the number of the PR on github you should review and merge.

2. For each PR I want you to merge you must perform the steps given below. Those steps are described below in more detail
* Pull PR
* Review PR: Perform a code review and prompt me whether we should continue
* Build PR: Pull the PR, build it and perform some tests
* Merge PR

# Pull PR
1. Check that no branch `merge-pr-{number}` exists. If it does forcible delete that branch.
2. Check out the PR into a new branch named `merge-pr-{number}` using `gh pr checkout {PR-number} -b merge-pr-{number}`. Do not create the branch with `git checkout -b` beforehand. Verify you are on the correct branch using `git branch`.

**Important**: After checkout, rely exclusively on `gh pr diff {PR-number} --name-only` to determine what the PR changes. Do NOT use `git log master..HEAD` or `git diff master..HEAD` — the remote branch may have extra commits beyond the PR HEAD that would produce misleading results.

# Review PR
1. Check if the PR looks valid. Use `gh pr diff {PR-number} --name-only` to get the list of changed files in the PR. Changes in the PR must only concern subfolders of frameworks and no other directory. Reasonable modifications to the root like `.gitignore` (e.g. adding build artifact patterns for a new framework's toolchain) are acceptable exceptions. Always print the result of that check.
2. PRs for implementations of the benchmark (subdirectories of the framework folders) should not modify files in webdriver-ts, the root directory or webdriver-ts-results. Reasonable modifications to the root `.gitignore` are an acceptable exception.
3. For implementations of the benchmark there must be no pre-install or post-install scripts in package.json
4. Check if the rendering library is available via npm and github. If not report a warning.
5. Perform a security audit especially regarding supply chain attacks
6. Take a look at the code. There are same cases that should be reported. Here's a list of the issues and the description you should check:
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
Applying RAF for selected benchmark operations should be avoided and is considered cheating: #166 #430
Using RAF for all operations in client code should be okay (that doesn't answer the question whether is's nice) since frameworks are allowed to use RAF under the covers too.



# Build PR

4. You must compute a list of folders that are affected by the PR. Can be a single folder or can be many folders. Example: If the files "package.json" and "package-lock.json" in frameworks/keyed/angular and "package.json" in "frameworks/non-keyed/react" are changed the list is "keyed/angular non-keyed/react", so you leave out the frameworks directory and only report the directory names. This list in the argument for the next step.
Always print the list.
Check if there are changed to files in the webdriver-ts folder (e.g. webdriver-ts/results.json). If so make sure to eliminate those changes by using `git checkout` to restore the original versions such they don't end in the main branch when merging.
5. If for each changed directory both package.json and package-lock.json are changed in the PR you must use `npm run rebuild-ci {list of framework-paths}`. Otherwise you must use `npm run rebuild {list of framework-path}` otherwise. You must concatenate all the directories with changes (which you computed above) in a format like "keyed/angular non-keyed/react".
You must also run the rebuild step for non javascript frameworks since it performs important tests.
    Just to explain: "npm run rebuild" must be used when the package-lock.json should be regenerated by
    npm install. "npm run rebuild-ci" can only be called when npm ci works and package.json and package-lock.json are in sync.
6. Check the output of the rebuild command.
    * **Success**: If the output contains "======> Please rerun the benchmark:", then the tests passed.
        * Check first if some file must be added to git and commit it. You can ignore all untracked files.
        * Merge the PR using merge commits as the merge strategy using git checkout and git merge (and NOT gh commands)
    * **Failure**: If the output does NOT contain the success message, or if you see errors like "checkElementExists failed":
        * **STOP**. Do not merge the PR.
        * Report the specific error to the user.
        * Do **NOT** attempt to fix the code in the framework (e.g., fixing filenames, changing logic) unless it is a trivial, obvious configuration mistake. If you think it's a simple fix, ask the user for permission first.

7. Delete the branch after merging
8. Print the {list of framework-paths} from above

## Rules:
* Never push automatically to the remote
* If you run into an error, stop executing and report the error