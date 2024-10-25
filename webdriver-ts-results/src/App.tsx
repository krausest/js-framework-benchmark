import "./App.css";
import { FrameworkType } from "@/Common";
import { knownIssues } from "@/helpers/issues";
import ResultTable from "@/components/ResultTable";
import SelectionToolbar from "@/components/SelectionToolbar";
import { List, Typography } from "antd";

const KnownIssuesList = () => {
  const data = knownIssues;

  return (
    <List
      header={<h2>Known issues and notes</h2>}
      bordered
      className="known-issues"
      dataSource={data}
      renderItem={(issue) => (
        <List.Item>
          <Typography.Text className="known-issues__issue-code">
            <a id={issue.number.toFixed()} href={issue.link}>
              {issue.number}
            </a>
          </Typography.Text>{" "}
          {issue.text}
        </List.Item>
      )}
    />
  );
};

const App = () => {
  // eslint-disable-next-line no-constant-condition
  const version = "Chrome 130.0.6723.58"
  const disclaimer = true ? (
    <div>
      <h2>js-framework-benchmark results for {version}</h2>
      <p>
        A description of the benchmark and the source code and can be found in the github{" "}
        <a href="https://github.com/krausest/js-framework-benchmark">repository</a>.
      </p>
    </div>
  ) : (
    <p>
      Warning: These results are preliminary - use with caution (they may e.g. be from different browser versions).
      Official results are published on the{" "}
      <a href="https://krausest.github.io/js-framework-benchmark/index.html">results page</a>.
    </p>
  );

  const testEnvironmentInfo = (
    <p>
      The benchmark was run on a MacBook Pro 14 (32 GB RAM, 8/14 Cores, OSX 15.0), {version}
      (arm64) using the puppeteer benchmark driver with reduced tracing.
    </p>
  );

  return (
    <>
      {disclaimer}
      {testEnvironmentInfo}
      <p>
        After chrome 119 official results we&apos;ve changed a detail for the benchmark: We now open a new tab for each
        benchmark iteration, earlier runs reused the tab per benchmark and implementation.
      </p>
      <p>
        Starting with chrome 118 the benchmark uses a{" "}
        <a href="https://github.com/krausest/js-framework-benchmark/wiki/Computation-of-the-weighted-geometric-mean">
          weighted geometric mean{" "}
        </a>{" "}
        to compute the overall result.
      </p>
      <main>
        <SelectionToolbar showDurationSelection={true} />
        <div>
          <ResultTable type={FrameworkType.KEYED} />
          <ResultTable type={FrameworkType.NON_KEYED} />
        </div>
        <KnownIssuesList />
      </main>
    </>
  );
};

export default App;
