export { TypeCheckPlugin } from './tsc-type-checker/tsc-type-checker.js';

export { RoutesPrecompilerPlugin } from './routes-precompiler/routes-precompiler.js';

export { ComponentPrecompilerPlugin } from './component-precompiler/component-precompiler.js';

export { ReactiveBindingPlugin } from './reactive-binding-compiler/reactive-binding-compiler.js';

export { RegisterComponentStripperPlugin } from './register-component-stripper/register-component-stripper.js';

export { GlobalCSSBundlerPlugin } from './global-css-bundler/global-css-bundler.js';

export { HTMLBootstrapInjectorPlugin, injectBootstrapHTML } from './html-bootstrap-injector/html-bootstrap-injector.js';

export { MinificationPlugin, minifySelectorsInHTML } from './minification/minification.js';

export { DeadCodeEliminatorPlugin } from './dead-code-eliminator/dead-code-eliminator.js';

export { PostBuildPlugin } from './post-build-processor/post-build-processor.js';
