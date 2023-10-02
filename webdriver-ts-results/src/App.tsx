import React from "react";
import "./App.css";
import { FrameworkType, knownIssues } from "./Common";
import ResultTable from "./components/ResultTable";
import { SelectionBar } from "./components/selection/SelectionBar";

const KnownIssuesList = () => {
  return (
    <>
      <section>
        <h3>Known issues and notes</h3>
        {knownIssues.map((issue) => (
          <dl key={issue.issue.toFixed()} id={issue.issue.toFixed()}>
            <dt>
              <a target="_blank" rel="noopener noreferrer" href={issue.link}>
                {issue.issue.toFixed()}
              </a>
            </dt>
            <dd>{issue.text}</dd>
          </dl>
        ))}
      </section>
    </>
  );
};

const App = () => {
  // eslint-disable-next-line no-constant-condition
  const disclaimer = false ? (
    <div>
      <h2>Results for js web frameworks benchmark - official run</h2>
      <p>
        A description of the benchmark and the source code and can be found in
        the github{" "}
        <a href="https://github.com/krausest/js-framework-benchmark">
          repository
        </a>
        .
      </p>
    </div>
  ) : (
    <p>
      Warning: These results are preliminary - use with caution (they may e.g.
      be from different browser versions). Official results are published on the{" "}
      <a href="https://krausest.github.io/js-framework-benchmark/index.html">
        results page
      </a>
      .
    </p>
  );

  const testEnvironmentInfo = (
    <p>
      The benchmark was run on a MacBook Pro 14 (32 GB RAM, 8/14 Cores, OSX 13.5.2), 
      Chrome 117.0.5938.62 (arm64) using the puppeteer benchmark driver
      with reduced tracing.
    </p>
  );

  return (
    <>
      {disclaimer}
      {testEnvironmentInfo}

      <main>
        <SelectionBar showDurationSelection={false} />
        <ResultTable type={FrameworkType.KEYED} />
        <ResultTable type={FrameworkType.NON_KEYED} />
        <KnownIssuesList></KnownIssuesList>
      </main>
    </>
  );
};

export default App;
