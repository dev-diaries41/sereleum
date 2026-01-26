"use client"
import { useEffect } from "react";
import { Data, Layout } from "plotly.js-dist-min";
import LoadingIndicator from "../utilities/circle-loading-indicator";

interface ChartDisplayProps {
  chartId: string;
  chartData: Data[];
  chartLayout: Partial<Layout>;
  loading: boolean;
  onRemoveChart?: () => void;
}

export function ChartDisplay({
  chartId,
  chartData,
  chartLayout,
  loading,
  onRemoveChart,
}: ChartDisplayProps) {

  useEffect(() => {
    const Plotly = require("plotly.js-dist-min");

    Plotly.newPlot(chartId, chartData, {
  ...chartLayout,
  autosize: true,
}, {
  displayModeBar: false, // disables the toolbar completely
  displaylogo: false,    // removes the Plotly logo if mode bar were shown
});


    const handleResize = () => {
      Plotly.Plots.resize(chartId);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartData, chartLayout]); // ← fixed

  if (chartData.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl rounded-2xl border border-gray-300 bg-gray-50">
      {loading && (
        <div className="flex flex-col items-center justify-center gap-2 absolute inset-0 z-10 bg-white/50">
          <p>Loading chart data...</p>
          <LoadingIndicator />
        </div>
      )}
      <div id={chartId} className="w-full h-full" />
      {onRemoveChart && (
        <button
          className="absolute top-0 right-4 text-red-500 cursor-pointer"
          onClick={onRemoveChart}
        >
          &#10006;
        </button>
      )}
    </div>
  );
}
