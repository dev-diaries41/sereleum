import {  SectionItem } from '@/app/types';

export const Features: SectionItem[] = [
  {
    title: "Prompt Clustering & Intent Discovery",
    description:
      "Automatically group semantically similar prompts to surface dominant user intents, workflows, and repeatable use cases.",
    image: "/prompt_clusters.png",
  },
  {
    title: "Token Usage & Cost by Cluster",
    description:
      "Track token consumption and cost at the use-case level, focusing on the highest-impact clusters driving spend.",
    image: "/prompt_clusters.png",
  },
  {
    title: "Cluster-Driven Prompt Template Discovery",
    description:
      "Identify high-value clusters where prompt structure can be standardized to reduce variance, improve quality, and lower cost.",
    image: "/prompt_clusters.png",
  },
  {
    title: "Template Impact Measurement",
    description:
      "Measure before-and-after changes in token usage and prompt length to quantify the impact of prompt templates.",
    image: "/prompt_clusters.png",
  },
];

export const UseCases: SectionItem[] = [
  {
    title: "Use Case Segmentation & Discoverability",
    description:
      "Understand how users actually interact with your product by surfacing dominant intents and workflows.",
    image: "/use_case_segmentation.png",
  },
  {
    title: "Prompt Template Optimization",
    description:
      "Design and refine prompt templates based on real user behavior in high-volume clusters.",
    image: "/use_case_segmentation.png",
  },
  {
    title: "System Prompt Refinement",
    description:
      "Align system-level behavior with observed user demand rather than assumptions.",
    image: "/use_case_segmentation.png",
  },
  {
    title: "Cost & Efficiency Optimization",
    description:
      "Identify expensive workflows and reduce LLM spend through targeted prompt standardization.",
    image: "/use_case_segmentation.png",
  },
  {
    title: "From Chat to Product Workflows",
    description:
      "Turn repeated free-form prompts into reliable, structured product experiences.",
    image: "/use_case_segmentation.png",
  },
];
