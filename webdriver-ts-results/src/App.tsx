import "./App.css";
import { FrameworkType } from "@/Common";
import { knownIssues } from "@/helpers/issues";
import ResultTable from "@/components/ResultTable";
import SelectionToolbar from "@/components/SelectionToolbar";

const KnownIssuesList = () => {
  const data = knownIssues;

  return (
    <section aria-labelledby="known-issues-title" className="known-issues">
      <h2 id="known-issues-title">Known issues and notes</h2>
      <p>Follow the issue numbers in the table for context on individual implementations.</p>
      <ul>
        {data.map((issue) => (
          <li key={issue.number}>
            <a id={issue.number.toFixed()} href={issue.link}>
              {issue.number}
            </a>{" "}
            {issue.text}
          </li>
        ))}
      </ul>
    </section>
  );
};

const App = () => {
  const version = "Chrome 152.0.7977.65";
  const isOfficial = false;
  const archiveUrl = "https://krausest.github.io/js-framework-benchmark/";

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to results
      </a>
      <header className="results-header workspace">
        <a className="results-brand" href={archiveUrl} aria-label="JavaScript Framework Benchmark home">
          <span className="results-brand__mark" aria-hidden="true">
            js
          </span>
          <span>
            framework
            <br />
            benchmark
          </span>
        </a>
        <nav aria-label="Project navigation">
          <a href={archiveUrl}>Results archive</a>
          <a href="https://github.com/krausest/js-framework-benchmark">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main" className="workspace" tabIndex={-1}>
        <section className="results-intro" aria-labelledby="page-title">
          <div className="results-intro__heading">
            <div>
              <p className="eyebrow">JavaScript Framework Benchmark</p>
              <h1 id="page-title">Interactive results</h1>
            </div>
            <span className="release-badge">{version}</span>
          </div>
          <p className="results-intro__description">
            Compare execution time, memory use and transfer size. Choose your implementations and benchmarks below.
          </p>
          {!isOfficial && (
            <p className="snapshot-notice">
              <strong>Development snapshot.</strong> These results are preliminary and may mix browser versions or run
              counts. Use the <a href={archiveUrl}>official releases</a> for published comparisons.
            </p>
          )}
          <details className="measurement-notes">
            <summary>Test environment &amp; methodology</summary>
            <div className="measurement-notes__content">
              <dl className="test-environment">
                <div>
                  <dt>Browser</dt>
                  <dd>{version} (arm64)</dd>
                </div>
                <div>
                  <dt>Hardware</dt>
                  <dd>MacBook Pro 14 · M4, 14/20 cores · 48 GB RAM</dd>
                </div>
                <div>
                  <dt>Operating system</dt>
                  <dd>OSX 26.6.2</dd>
                </div>
              </dl>
              <p>Measured with the Puppeteer benchmark driver and reduced tracing.</p>
              <p>
                Starting with Chrome 118, the overall result uses a{" "}
                <a href="https://github.com/krausest/js-framework-benchmark/wiki/Computation-of-the-weighted-geometric-mean">
                  weighted geometric mean
                </a>
                . After Chrome 119, each benchmark iteration opens a new tab; earlier runs reused the tab per benchmark
                and implementation.
              </p>
              <p>
                Since Chrome 137, non-keyed implementations are benchmarked only for even Chrome versions. Read the{" "}
                <a href="https://github.com/krausest/js-framework-benchmark#about-the-benchmarks">
                  benchmark documentation
                </a>{" "}
                before comparing releases.
              </p>
            </div>
          </details>
        </section>
        <section className="results-controls" aria-labelledby="controls-title">
          <div className="results-controls__heading">
            <h2 id="controls-title">Build your comparison</h2>
            <p>Filter the table, switch views or copy your selection.</p>
          </div>
          <SelectionToolbar showDurationSelection={true} />
        </section>
        <div className="result-groups">
          <ResultTable type={FrameworkType.KEYED} />
          <ResultTable type={FrameworkType.NON_KEYED} />
        </div>
        <KnownIssuesList />
      </main>
      <footer className="results-footer workspace">
        <p>JavaScript Framework Benchmark · Stefan Krause and contributors</p>
        <a href="https://github.com/krausest/js-framework-benchmark">Source code &amp; methodology</a>
      </footer>
    </>
  );
};

export default App;
