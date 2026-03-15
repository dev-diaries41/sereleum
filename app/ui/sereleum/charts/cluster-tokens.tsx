"use client";
import { useMemo } from "react";
import { Data, Layout } from "plotly.js-dist-min";
import { PromptsOverviewInfo, UNLABELLED_CLUSTER } from "@/app/types";
import dynamic from "next/dynamic";

const MAX_LABEL_LENGTH= 24

const truncateLabel = (label: string) => label.length > MAX_LABEL_LENGTH ? label.slice(0, MAX_LABEL_LENGTH) + "…" : label;

const ChartDisplay = dynamic(
  () => import("@/app/ui/common/charts").then(mod => mod.ChartDisplay),
  { ssr: false }
);

interface TokenUsageByClusterChartProps {
  overview: PromptsOverviewInfo;
  loading: boolean;
  onRemoveChart?: () => void;
}

export function TokenUsageByClusterChart({
  overview,
  loading,
}: TokenUsageByClusterChartProps) {

  const { data, layout } = useMemo(() => {
    const clustersWithValues = overview.top_clusters.map((c) => {
      const label = c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label;
      const value = overview.top_cluster_token_counts[c.prototype_id] * c.metadata.prototype_size;
      return { label, value };
    }).sort((a, b) => a.value - b.value);

    const labels = clustersWithValues.map(c => truncateLabel(c.label));
    const values = clustersWithValues.map(c => c.value);

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
        text: "Token usage by cluster",
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
  }, [overview]);

  return (
    <ChartDisplay
      chartId="token-usage-by-cluster"
      chartData={data}
      chartLayout={layout}
      loading={loading}
    />
  );
}