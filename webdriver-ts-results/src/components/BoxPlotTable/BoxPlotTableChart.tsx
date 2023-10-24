import React, { useRef, useEffect } from "react";
import Plotly from "plotly.js-cartesian-dist";

interface BoxPlotData {
  framework: string;
  values: number[];
}

interface Props {
  traces: Array<BoxPlotData>;
}

const BoxPlotTableChart = ({ traces }: Props) => {
  const elemRef = useRef(null);

  useEffect(() => {
    const plotlTtraces = traces.map((t) => ({
      type: "box",
      y: t.values,
      boxpoints: false,
      jitter: 0.5,
      name: t.framework,
      boxmean: "sd",
    }));

    const layout = {
      showlegend: false,
      margin: {
        l: 40,
        r: 0,
        b: 120,
        t: 0,
        pad: 0,
      },
    };
    Plotly.newPlot(elemRef.current, plotlTtraces, layout, {
      staticPlot: true,
      editable: false,
    });
  }, [traces]);
  return <div ref={elemRef} style={{ height: "100%", width: "100%" }}></div>;
};

export default BoxPlotTableChart;
