/**
 * Vite plugin to replace `<%=FOO%>` in index.html with the data provided
 * to this plugin (specifically, the output of `data["FOO"]`).
 *
 * If the input data does not contain the required key, throw an error.
 *
 * Setup: add `injectHtmlVars({FOO: "bar"})` to vite plugins config.
 *
 * Warning: there is no built-in safety. What you inject is what you get.
 * Do not inject unsanitized attacker-provided data. Read about HTML
 * injection vulnerabilities if you're not sure:
 * https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/03-Testing_for_HTML_Injection
 */
export default function injectHtmlVarsPlugin(data) {
  return {
    name: 'inject-html-vars',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => {
        return html.replace(
          /<%=\s*(\w+)\s*%>/gi,
          (match, p1) => {
            if (data.hasOwnProperty(p1)) {
              return data[p1]
            } else {
              throw new Error(`injectHtmlVarsPlugin: Error: Your HTML file contains <%=${p1}%>, but you did not provide a value for '${p1}' to the local-inject-html-vars vite plugin.`)
            }
          }
        );
      }
    }
  }
}