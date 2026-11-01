"use client"

import { useMemo } from "react";
import { Data, Layout } from "plotly.js-dist-min";
import { Cluster } from "@/app/types";
import dynamic from "next/dynamic";
import { UNLABELLED_CLUSTER } from "@/app/constants/clusters";

const MAX_LABEL_LENGTH= 24

const truncateLabel = (label: string) => label.length > MAX_LABEL_LENGTH ? label.slice(0, MAX_LABEL_LENGTH) + "…" : label;

const ChartDisplay = dynamic(
  () => import("@/app/ui/common/charts").then(mod => mod.ChartDisplay),
  { ssr: false }
);

interface ClusterDensityChartProps {
  clusters: Cluster[];
  loading: boolean;
  onRemoveChart?: () => void;
}

export function ClusterDensityChart({
  clusters,
  loading,
}: ClusterDensityChartProps) {
  const { data, layout } = useMemo(() => {
    const sortedClusters = clusters.sort((a, b) => a.prototype_size - b.prototype_size);
    const labels = sortedClusters.map(c =>truncateLabel(c.label === UNLABELLED_CLUSTER ? c.id : c.label));
    const values = sortedClusters.map((c) =>c.prototype_size);

     const data: Data[] = [
      {
        type: "bar",
        orientation: "h",
        y: labels,
        x: values,
        marker: { color: '#1f77b4' },
        width: 0.5,
      },
    ];

    const layout: Partial<Layout> = {
      title: {
        text: "Number of prompts per cluster",
        x: 0.5,
        xanchor: "center",
        font: {
          size: 16,       
          weight: 600,
        }, 
      },
    margin: { t: 60, l: 20, r: 20, b: 70 },
      xaxis: {  automargin: true},
      yaxis: { automargin: true, tickfont: { size: 11 } },
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
