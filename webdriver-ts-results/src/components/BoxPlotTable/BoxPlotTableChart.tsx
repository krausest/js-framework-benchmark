import { useRef, useEffect } from "react";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import { Chart, ChartConfiguration } from "chart.js";

Chart.register(BoxPlotChart);

const backgroundColor = [
  "hsl(0 80% 50%)", // Red
  "hsl(40 80% 50%)", // Orange
  "hsl(80 80% 50%)", // Yellow
  "hsl(120 80% 50%)", // Green
  "hsl(160 80% 50%)", // Cyan
  "hsl(200 80% 50%)", // Blue
  "hsl(240 80% 50%)", // Purple
  "hsl(280 80% 50%)", // Magenta
  "hsl(320 80% 50%)", // Pink
];

interface BoxPlotData {
  framework: string;
  values: number[];
}

interface Props {
  traces: Array<BoxPlotData>;
}

const BoxPlotTableChart = ({ traces }: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const labels: string[] = [];
    const data: number[][] = [];

    for (const trace of traces) {
      labels.push(trace.framework);
      data.push(trace.values);
    }

    const config: ChartConfiguration<"boxplot"> = {
      type: "boxplot",
      data: {
        labels,
        datasets: [
          {
            backgroundColor,
            data,
          },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        minStats: "min",
        maxStats: "max",
        coef: 0,
        scales: {
          x: {
            type: "category",
            grid: {
              display: false,
            },
          },
          y: {
            type: "linear",
            beginAtZero: false,
          },
        },
      },
    };

    const chart = new BoxPlotChart(chartRef.current!, config);

    return () => {
      chart.destroy();
    };
  }, [traces]);

  return (
    <div style={{ height: "250px" }}>
      <canvas style={{ maxHeight: "100%" }} ref={chartRef}></canvas>
    </div>
  );
};

export default BoxPlotTableChart;
