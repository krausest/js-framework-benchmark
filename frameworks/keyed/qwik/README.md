# Qwik

Please note that this benchmark does not test the true power of Qwik, namely resumability. So the expected result is that Qwik is average in this benchmark, but it is much faster in real world applications.

See https://qwik.builder.io/docs/concepts/think-qwik/

## Build

The build uses the SSG capabilities of Qwik to create the static files.

Note: `npm build-prod` involves moving the built files to the root of the dist dir, because Vite outputs the full directory structure that is expected, and we need to "deploy" this so the benchmark can load the files.

That is to say, while `/dist` is the serving location for the benchmark, the files are actually built in `/dist/frameworks/keyed/qwik/dist`.
