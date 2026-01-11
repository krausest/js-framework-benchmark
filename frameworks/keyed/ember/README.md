# ember + js-framework-benchmark


Deviations from the standard vite blueprint
- js-framework-benchmark does not allow us to have a dev-time index.html in the project root. So I disabled hashing on files, and the root index.html is now a static thing that points at the dist directory
- an extra route had to be added to match on explicit `index.html`. No frontend framework wants index.html in the URL, so this is a goofy choice for jsfb.
- this is a _minimal_ project, no compatibility with legacy libraries
- no use of decorators, or the babel decorators transform -- this is because decorators incur a runtime cost, and we use so few of them, the ergonomic wins of decorators are not worth it atm.  Once browsers ship native decorators, we can add them back.
