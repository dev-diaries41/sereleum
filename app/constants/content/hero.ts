import {  SectionItem } from '@/app/types';
import { faChartLine, faCoins, faLayerGroup, faMoneyBill, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

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

import { 
  faUsers, 
  faMagic, 
  faCog, 
  faProjectDiagram 
} from "@fortawesome/free-solid-svg-icons";

export const UseCases: SectionItem[] = [
  {
    title: "Use Case Segmentation & Discoverability",
    description:
      "Understand how users actually interact with your product by surfacing dominant intents and workflows.",
    icon: faUsers,
  },
  {
    title: "Prompt Template Optimization",
    description:
      "Design and refine prompt templates based on real user behavior in high-volume clusters.",
    icon: faMagic,
  },
  {
    title: "System Prompt Refinement",
    description:
      "Align system-level behavior with observed user demand rather than assumptions.",
    icon: faCog,
  },
  {
    title: "Cost & Efficiency Optimization",
    description:
      "Identify expensive workflows and reduce LLM spend through targeted prompt standardization.",
    icon: faMoneyBill,
  },
];

  export const FlowDiagramSteps = [
    { title: 'Analyse prompts', icon: faChartLine },
    {title: 'Understand user intent', icon: faLayerGroup },
    {title: 'Optimise product', icon: faCoins },
    {title: 'Better UX & outcomes', icon: faShieldHalved },
  ];