const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/frameworks/keyed/anansi/js-framework-wasm/sw.js',
        {
          scope: '/frameworks/keyed/anansi/js-framework-wasm/',
        }
      );
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
registerServiceWorker();

let mod;
const ids = new Map();

document.addEventListener('click', (e) => {
  let paths = e.composedPath();
  let callback;
  let id;

  for (let i = 0; i < paths.length; i++) {
    let el = paths[i];

    let attributes = el.attributes;
    if (attributes) {
      let onclick = attributes.getNamedItem('on:click');
      if (onclick) {
        let aid = ids.get(onclick.value);
        if (!aid) {
          aid = attributes.getNamedItem('a:id');
          ids.set(onclick.value, aid);
        }
        if (onclick && aid) {
          callback = onclick.value;
          id = aid.value;
          break;
        }
      }
      let rid = attributes.getNamedItem('rid');
      if (rid) {
        let called = mod.recall(rid.value);
        if (called) {
          return;
        }
      }
    }
  }
  if (callback) {
    if (mod) {
      mod.call(callback, id);
    } else {
      import('/frameworks/keyed/anansi/js-framework-wasm/pkg/js_framework_wasm.js').then((module) => {
        module.default().then(() => {
          module.start();
          mod = module;
          mod.call(callback, id);
        });
      });
    }
  }
});
