"use client"

import { useMemo } from "react";
import { Data, Layout } from "plotly.js-dist-min";
import { Cluster, UNLABELLED_CLUSTER } from "@/app/types";
import { ChartDisplay } from "../../common/charts";

interface NumberPromptsPerClusterChartProps {
  clusters: Cluster[];
  loading: boolean;
  onRemoveChart?: () => void;
}

export function NumberPromptsPerClusterChart({
  clusters,
  loading,
}: NumberPromptsPerClusterChartProps) {
  const { data, layout } = useMemo(() => {
    const maxLabelLength= 20
    const labels = clusters.map((c) => {
      const text = c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label;
      if (text.length > maxLabelLength) {
        return text.match(new RegExp(`.{1,${maxLabelLength}}`, "g"))?.join("<br>") || text;
      }
      return text;
    });

    const values = clusters.map(
      (c) =>c.metadata.prototype_size
    );

    const data: Data[] = [
      {
        type: "bar",
        x: labels,
        y: values,
        width: 0.3,
      },
    ];

    const layout: Partial<Layout> = {
    title: {
        text: "Number of prompts per cluster",
        x: 0.5,
        xanchor: "center",
    },
    margin: { t: 48, l: 50, r: 20, b: 80 },
    xaxis: {
        title: { text: "Cluster" },
        tickangle: -30,
        automargin: true, 
          tickfont: {
      size: 8, // smaller font size
    },

    },
    yaxis: {
        title: { text: "Prompts" },
        automargin: true, 
    },
    };

    return { data, layout };
  }, [clusters]);

  return (
    <ChartDisplay
      chartId="n-prompts-in-cluster"
      chartData={data}
      chartLayout={layout}
      loading={loading}
    />
  );
}
