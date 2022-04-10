const getScripts = require("@ui5/webcomponents-tools/components-package/nps.js"); //eslint-disable-line

const options = {
	port: 8080,
};

const scripts = getScripts(options);

scripts.build.i18n = "";
scripts.build.jsonImports = "";
scripts.build.styles = "";
scripts.build.samples = "";
scripts.build.illustrations = "";
scripts.copy["webcomponents-polyfill"] = "";
scripts.lint = "";

module.exports = {
	scripts,
};
