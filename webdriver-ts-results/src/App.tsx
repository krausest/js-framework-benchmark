import * as React from 'react';
import './App.css';
import { FrameworkType, knownIssues } from './Common';
import ResultTable from './ResultTable';
import { SelectionBar } from './selection/SelectionBar';

const App = () => {

  let disclaimer = (false) ? (<div>
        <h2>Results for js web frameworks benchmark - official run</h2>
        <p>A description of the benchmark and the source code and can be found in the github <a href="https://github.com/krausest/js-framework-benchmark">repository</a>.</p>
      </div>) :
      (<p>Warning: These results are preliminary - use with caution (they may e.g. be from different browser versions). Official results are published on the <a href="https://krausest.github.io/js-framework-benchmark/index.html">results page</a>.</p>);

    return (
      <div>
        {disclaimer}
        <p>The benchmark was run on a Razer Blade 15 Advanced (i7-8750H, 32 GB RAM, Ubuntu 20.04 (Linux 5.4.0-42, mitigations=off), Chrome 86.0.4240.75 (64-bit))</p>
         <SelectionBar/>
         <ResultTable type={FrameworkType.KEYED}/>
         <ResultTable type={FrameworkType.NON_KEYED}/>

          <h3>Known Issues</h3>
          {knownIssues.map(issue =>
            <dl key={issue.issue.toFixed()} id={issue.issue.toFixed()}>
              <dt><a target="_blank" rel="noopener noreferrer" href={issue.link}>{issue.issue.toFixed()}</a></dt>
              <dd>{issue.text}</dd>
            </dl>
          )}
      </div>);
}

export default App;