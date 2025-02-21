#!/usr/bin/env bash

# NOTE: the tooling will not detect us as a benchable implementation
# unless there is a package-lock.json
#
# At the very least this script documents
# how to interact with the jsfb packages...
# at least in one point in time.
#
#
# Things to do before submitting a PR:
# ./checks.sh setup
# ./checks.sh isKeyed
# ./checks.sh verify


case "$1" in
  # 1. Do this first
  setup)
    # Build ourselves
    npm run build-prod

    # Build webdriver-ts
    cd ../../../webdriver-ts
    pnpm install
    pnpm rebuild
    pnpm compile

    cd ../webdriver-ts-results
    npm ci
  ;;
  # 2. Start the server (on port 8080)
  start)
    # https://github.com/krausest/js-framework-benchmark/tree/chrome110?tab=readme-ov-file#22-start-installing
    cd ../../../
    npm install
    # pnpm install
    # They are missing a dependency
    # pnpm add @esbuild/linux-x64@0.23.1
    # pnpm rebuild
    # pnpm start
    npm start
  ;;

  # 3. Verify
  isKeyed)
    cd ../../../webdriver-ts
    npm run isKeyed keyed/ember
    ;;
  # 4. Run the Bench
  bench)
    cd ../../../webdriver-ts
    npm run bench keyed/ember
    ;;
  verify)
    cd ../../..
    npm run rebuild-ci keyed/ember
    ;;
  results)
    cd ../../../webdriver-ts
    npm run results

    echo "View: http://localhost:8080/webdriver-ts-results/table.html"
    ;;
  *)
    echo "$arg not recognized"
    ;;
esac
