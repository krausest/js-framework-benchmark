# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations.

Thanks for the great work.

## Changes

- more test cases
- add versioning for testing mulitple versions of the same platform
- tweaking on test runs (allows to re-runs all the cases/platforms)

## Prerequsites

Have *node.js* installed. If you want to do yourself a favour use nvm for that. The benchmark has been tested with node 5.1+.
You will also need *mvn* for *selenium*.

## Building

* To build the benchmarks for all frameworks:

`npm install`

`npm run build`

The latter calls npm build-prod in each subproject.

* To build a single benchmark for a framework, e.g. aurelia

`cd aurelia`

`npm install`

`npm run build-prod`

## Running in the browser

Execute `npm start` in the main directory to start a http-server for the web pages.
Open [http://localhost:8080](http://localhost:8080/) and choose the directory for the framework you want to test.
Most actions will try to measure the duration and print it to the console. Depending on the framework this might be more or less precise. To measure the exact numbers one needs to use e.g. the timeline from the chrome dev tools.

## About the benchmarks

* create 1000 rows: Time for creating a table with 1000 rows after the page loaded.
* update 1000 rows (hot): Time for updating all 1000 rows of the table. A few iterations to warmup the javascript engine are performed before measuring.
* partial update: Time to update the text of every 10th row. A few iterations to warmup the javascript engine are performed before measuring.
* select row: Duration to highlight a row in response to a click on the row. A few iterations to warmup the javascript engine are performed before measuring.
* remove row: Duration to remove a row. A few iterations to warmup the javascript engine are performed before measuring.
* hide all: Time for hiding all the rows
* show all: Timne for showing all the rows (after being hidden)
* create lots of rows: Time for creating a table lots a rows (currently 10.000).
* add 1000 rows after lots of rows: Time for adding 1000 rows on a table of add 1000 rows after lots of rows.
* clear rows: Time to clear the table filled with 10.000 rows
* clear rows a 2nd time: Time to clear the table filled with 10.000 rows. But warmed up with only one iteration.
* select row on big list: Time to select a row on a 10K table.
* swap rows: Time to swap 2 rows (1K table).
* recycle rows: Time to create 1000 rows after clearing a 1K table.

## Execute the benchmarks with selenium

You need to have a current java and maven installation to run the automated benchmark.

`npm start`
which starts a web browser
`npm run selenium`
which runs the seleniums tests

Open [http://localhost:8080/webdriver-java/chart.html](http://localhost:8080/webdriver-java/chart.html) for the results

A test showing the durations on my machine can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-java/chart.html)

## Results

<table>
<thead>
<tr>
<th></th>
<th>angular v1.5.3</th>
<th>angular v2.0.0-beta.2</th>
<th>angular v2.0.0-beta.15</th>
<th>aurelia</th>
<th>ember</th>
<th>mithril v0.2.3</th>
<th>plastiq v1.28.0</th>
<th>preact v2.8.3</th>
<th>ractive v0.7.3</th>
<th>react v0.14.8</th>
<th>react-lite v0.0.18</th>
<th>react-lite v0.15.9</th>
<th>vidom v0.1.7</th>
<th>vue v1.0.21</th>
</tr>
</thead>
<tbody>
<tr>
<th>create 1000 rows</th>
<td style="background-color:#FFEC84">873.34</td>
<td style="background-color:#63BF7C">577.72</td>
<td style="background-color:#FFEC84">834.64</td>
<td style="background-color:#63BF7C">650.42</td>
<td style="background-color:#F9696C">1922</td>
<td style="background-color:#FFEC84">942.53</td>
<td style="background-color:#63BF7C">654.64</td>
<td style="background-color:#FFEC84">820.54</td>
<td style="background-color:#F9696C">1586.52</td>
<td style="background-color:#F9696C">1378.46</td>
<td style="background-color:#63BF7C">639.20</td>
<td style="background-color:#63BF7C">488.94</td>
<td style="background-color:#63BF7C">489.97</td>
<td style="background-color:#FFEC84">783.28</td>
</tr>
<tr>
<th>update 1000 rows (hot)</th>
<td style="background-color:#F9696C">908.34</td>
<td style="background-color:#FFEC84">631.91</td>
<td style="background-color:#FFEC84">823.20</td>
<td style="background-color:#63BF7C">387.99</td>
<td style="background-color:#F9696C">1536.66</td>
<td style="background-color:#F9696C">929.53</td>
<td style="background-color:#FFEC84">683.63</td>
<td style="background-color:#63BF7C">403.20</td>
<td style="background-color:#63BF7C">253.11</td>
<td style="background-color:#FFEC84">786.77</td>
<td style="background-color:#FFEC84">662.68</td>
<td style="background-color:#FFEC84">598.42</td>
<td style="background-color:#FFEC84">500.81</td>
<td style="background-color:#FFEC84">766.75</td>
</tr>
<tr>
<th>partial update</th>
<td style="background-color:#63BF7C">54.90</td>
<td style="background-color:#63BF7C">44.40</td>
<td style="background-color:#63BF7C">39.54</td>
<td style="background-color:#63BF7C">40.54</td>
<td style="background-color:#F9696C">136.7</td>
<td style="background-color:#F9696C">340.51</td>
<td style="background-color:#F9696C">275.82</td>
<td style="background-color:#FFEC84">95.24</td>
<td style="background-color:#F9696C">115.75</td>
<td style="background-color:#FFEC84">67.30</td>
<td style="background-color:#63BF7C">60.12</td>
<td style="background-color:#FFEC84">77.57</td>
<td style="background-color:#FFEC84">64.36</td>
<td style="background-color:#63BF7C">52.28</td>
</tr>
<tr>
<th>select row</th>
<td style="background-color:#63BF7C">22.33</td>
<td style="background-color:#63BF7C">13.25</td>
<td style="background-color:#63BF7C">18.71</td>
<td style="background-color:#F9696C">78.85</td>
<td style="background-color:#F9696C">135.79</td>
<td style="background-color:#F9696C">342.23</td>
<td style="background-color:#F9696C">248.09</td>
<td style="background-color:#FFEC84">31.54</td>
<td style="background-color:#FFEC84">30.62</td>
<td style="background-color:#FFEC84">29.65</td>
<td style="background-color:#FFEC84">29.77</td>
<td style="background-color:#FFEC84">48.27</td>
<td style="background-color:#FFEC84">35.01</td>
<td style="background-color:#FFEC84">37.53</td>
</tr>
<tr>
<th>remove row</th>
<td style="background-color:#63BF7C">262.76</td>
<td style="background-color:#FFEC84">523</td>
<td style="background-color:#FFEC84">534.21</td>
<td style="background-color:#FFEC84">336.19</td>
<td style="background-color:#FFEC84">379.36</td>
<td style="background-color:#F9696C">595.26</td>
<td style="background-color:#FFEC84">481.13</td>
<td style="background-color:#FFEC84">359.71</td>
<td style="background-color:#F9696C">713.19</td>
<td style="background-color:#63BF7C">292.19</td>
<td style="background-color:#F9696C">701.93</td>
<td style="background-color:#63BF7C">268.97</td>
<td style="background-color:#63BF7C">287.80</td>
<td style="background-color:#63BF7C">277.01</td>
</tr>
<tr>
<th>hide all</th>
<td style="background-color:#FFEC84">165.22</td>
<td style="background-color:#FFEC84">149.77</td>
<td style="background-color:#FFEC84">167.63</td>
<td style="background-color:#FFEC84">204.35</td>
<td style="background-color:#F9696C">377.38</td>
<td style="background-color:#63BF7C">100.72</td>
<td style="background-color:#FFEC84">118.67</td>
<td style="background-color:#FFEC84">126.69</td>
<td style="background-color:#F9696C">945.73</td>
<td style="background-color:#FFEC84">112.16</td>
<td style="background-color:#63BF7C">87.79</td>
<td style="background-color:#63BF7C">100.11</td>
<td style="background-color:#63BF7C">99.73</td>
<td style="background-color:#FFEC84">126.92</td>
</tr>
<tr>
<th>show all</th>
<td style="background-color:#FFEC84">709.41</td>
<td style="background-color:#63BF7C">529.49</td>
<td style="background-color:#FFEC84">720.87</td>
<td style="background-color:#63BF7C">576.89</td>
<td style="background-color:#F9696C">1401.37</td>
<td style="background-color:#F9696C">835.07</td>
<td style="background-color:#FFEC84">606.25</td>
<td style="background-color:#FFEC84">628.67</td>
<td style="background-color:#F9696C">1050.97</td>
<td style="background-color:#FFEC84">696.13</td>
<td style="background-color:#63BF7C">535.08</td>
<td style="background-color:#63BF7C">414.99</td>
<td style="background-color:#63BF7C">431.02</td>
<td style="background-color:#FFEC84">687.59</td>
</tr>
<tr>
<th>create lots of rows</th>
<td style="background-color:#FFEC84">7112.42</td>
<td style="background-color:#63BF7C">5440.13</td>
<td style="background-color:#FFEC84">7855.89</td>
<td style="background-color:#63BF7C">988.08</td>
<td style="background-color:#F9696C">13556.33</td>
<td style="background-color:#F9696C">9363</td>
<td style="background-color:#63BF7C">5990.74</td>
<td style="background-color:#FFEC84">7603.70</td>
<td style="background-color:#F9696C">27668.03</td>
<td style="background-color:#FFEC84">8100.18</td>
<td style="background-color:#63BF7C">5699.20</td>
<td style="background-color:#63BF7C">2763.71</td>
<td style="background-color:#63BF7C">4157.74</td>
<td style="background-color:#FFEC84">7363.43</td>
</tr>
<tr>
<th>add 1000 rows after lots of rows</th>
<td style="background-color:#FFEC84">2581.28</td>
<td style="background-color:#FFEC84">2010.98</td>
<td style="background-color:#FFEC84">2348.8</td>
<td style="background-color:#FFEC84">2245.09</td>
<td style="background-color:#F9696C">3759.77</td>
<td style="background-color:#F9696C">6266.81</td>
<td style="background-color:#F9696C">3161.71</td>
<td style="background-color:#63BF7C">1220.29</td>
<td style="background-color:#F9696C">9454.74</td>
<td style="background-color:#63BF7C">1172.52</td>
<td style="background-color:#63BF7C">984.77</td>
<td style="background-color:#F9696C">4271.65</td>
<td style="background-color:#63BF7C">882.38</td>
<td style="background-color:#FFEC84">2282.07</td>
</tr>
<tr>
<th>clear rows</th>
<td style="background-color:#F9696C">3436.78</td>
<td style="background-color:#FFEC84">1286</td>
<td style="background-color:#FFEC84">1503.39</td>
<td style="background-color:#FFEC84">1863.18</td>
<td style="background-color:#F9696C">2897.75</td>
<td style="background-color:#63BF7C">1003.32</td>
<td style="background-color:#63BF7C">801.33</td>
<td style="background-color:#63BF7C">885.20</td>
<td style="background-color:#F9696C">9520.64</td>
<td style="background-color:#FFEC84">1085.85</td>
<td style="background-color:#63BF7C">778.67</td>
<td style="background-color:#63BF7C">959.29</td>
<td style="background-color:#FFEC84">1203.80</td>
<td style="background-color:#FFEC84">1240.18</td>
</tr>
<tr>
<th>clear rows a 2nd time</th>
<td style="background-color:#F9696C">6535.44</td>
<td style="background-color:#FFEC84">1746.36</td>
<td style="background-color:#FFEC84">1342.49</td>
<td style="background-color:#FFEC84">1800.42</td>
<td style="background-color:#F9696C">4243.42</td>
<td style="background-color:#63BF7C">1001.68</td>
<td style="background-color:#63BF7C">771.45</td>
<td style="background-color:#63BF7C">905.80</td>
<td style="background-color:#F9696C">6494.80</td>
<td style="background-color:#FFEC84">1037.78</td>
<td style="background-color:#63BF7C">890.35</td>
<td style="background-color:#63BF7C">934.57</td>
<td style="background-color:#FFEC84">1989.56</td>
<td style="background-color:#FFEC84">1198.84</td>
</tr>
<tr>
<th>select row on big list</th>
<td style="background-color:#63BF7C">127</td>
<td style="background-color:#63BF7C">89.45</td>
<td style="background-color:#FFEC84">155.60</td>
<td style="background-color:#FFEC84">403.55</td>
<td style="background-color:#F9696C">1321.67</td>
<td style="background-color:#F9696C">3095.11</td>
<td style="background-color:#F9696C">2099.31</td>
<td style="background-color:#63BF7C">132.94</td>
<td style="background-color:#FFEC84">246.63</td>
<td style="background-color:#63BF7C">130.01</td>
<td style="background-color:#FFEC84">163.83</td>
<td style="background-color:#F9696C">3031.96</td>
<td style="background-color:#FFEC84">208.92</td>
<td style="background-color:#FFEC84">314.81</td>
</tr>
<tr>
<th>swap rows</th>
<td style="background-color:#FFEC84">208.48</td>
<td style="background-color:#FFEC84">173.75</td>
<td style="background-color:#FFEC84">191.25</td>
<td style="background-color:#63BF7C">68.10</td>
<td style="background-color:#F9696C">262.18</td>
<td style="background-color:#F9696C">577.63</td>
<td style="background-color:#F9696C">405.83</td>
<td style="background-color:#63BF7C">60.38</td>
<td style="background-color:#FFEC84">113.91</td>
<td style="background-color:#FFEC84">211.90</td>
<td style="background-color:#FFEC84">191.58</td>
<td style="background-color:#FFEC84">185.90</td>
<td style="background-color:#FFEC84">233.98</td>
<td style="background-color:#FFEC84">202.96</td>
</tr>
<tr>
<th>recycle rows</th>
<td style="background-color:#FFEC84">728.37</td>
<td style="background-color:#63BF7C">532.98</td>
<td style="background-color:#FFEC84">729.63</td>
<td style="background-color:#63BF7C">581.28</td>
<td style="background-color:#F9696C">1343.42</td>
<td style="background-color:#FFEC84">846.28</td>
<td style="background-color:#FFEC84">624.49</td>
<td style="background-color:#FFEC84">656.65</td>
<td style="background-color:#F9696C">1037.64</td>
<td style="background-color:#FFEC84">713.14</td>
<td style="background-color:#63BF7C">558.03</td>
<td style="background-color:#63BF7C">431.85</td>
<td style="background-color:#63BF7C">449.70</td>
<td style="background-color:#FFEC84">696.36</td>
</tr>
</tbody>
</table>

Those results have been generated with Chromium 48.0.2564.116 on a Mac mini 2010.