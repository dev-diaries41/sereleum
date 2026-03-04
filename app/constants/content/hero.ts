import {  SectionItem } from '@/app/types';
import { faChartLine, faCoins, faDatabase, faLayerGroup, faShieldHalved, faTag } from '@fortawesome/free-solid-svg-icons';

export const Features: SectionItem[] = [
  {
    title: "Prompt Clustering & Intent Discovery",
    description:
      "Automatically group semantically similar prompts to surface dominant user intents, workflows, and repeatable use cases.",
    image: "/screenshots/cluster-plot.png",
  },
  {
    title: "Token Usage & Cost by Cluster",
    description:
      "Track token consumption and cost at the use-case level, focusing on the highest-impact clusters driving spend.",
    image: "/screenshots/token-usage-cluster.png",
  },
  {
    title: "Cluster-Driven System Prompt Refinement",
    description:
      "Align LLM system-prompts with observed user demand rather than assumptions.",
    image: "/optimise-system-prompt.png",
  },
  {
    title: "Cluster-Driven Prompt Templates",
    description:
      "Use clusters to create reusable prompt templates, improving workflow efficiency and UX consistency.",
    image: "/prompt-templates.png",
  }
];

  export const FlowDiagramSteps = [
    { title: 'Analyse Prompts', icon: faChartLine },
    {title: 'Understand User Intent', icon: faLayerGroup },
    {title: 'Optimise Product', icon: faCoins },
    {title: 'Better UX & Outcomes', icon: faShieldHalved },
  ];


  export const HowItWorksSteps: SectionItem[] = [
    {
      title: "1. Indexing",
      description: "Add prompts, generate embeddings, and store prompts, embeddings, and metadata.",
      icon: faDatabase
    },
    {
      title: "2. Clustering",
      description:"Incremental clustering groups prompts as new data arrives.",
      icon: faLayerGroup
    },
    {
      title: "3. Labelling",
      description: "LLM labels clusters, with manual fallback when confidence is low.",
      icon: faTag
    },
  ];