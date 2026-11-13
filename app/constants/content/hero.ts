
import { SectionItem } from '@/app/types';
import {
  faDatabase,
  faLayerGroup,
  faTag,
  faFolderOpen,
  faFileLines,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

export const Features: SectionItem[] = [
  {
    title: "Document Indexing & Semantic Search",
    description:
      "Index documents and generate semantic representations of their content, making information easier to explore and retrieve.",
    image: "/screenshots/dashboard-page.png",
  },
  {
    title: "Semantic Clustering",
    description:
      "Automatically group semantically similar documents to uncover shared topics, relationships, and recurring themes across your data.",
    image: "/screenshots/clusters-page.png",
  },
  {
    title: "Automatic Cluster Labelling",
    description:
      "Use LLMs to generate meaningful labels for document clusters, making groups easier to understand, identify, and navigate.",
    image: "/screenshots/cluster-details-page.png",
  },
  {
    title: "Tagging & Collection Management",
    description:
      "Organise documents through a unified collection system, combining automatically generated clusters with manually managed tags.",
    image: "/screenshots/prompts-page.png",
  },
];

export const FlowDiagramSteps = [
  { title: "Index Documents", icon: faDatabase },
  { title: "Discover Patterns", icon: faLayerGroup },
  { title: "Organise Collections", icon: faFolderOpen },
  { title: "Explore & Retrieve", icon: faMagnifyingGlass },
];

export const HowItWorksSteps: SectionItem[] = [
  {
    title: "1. Indexing",
    description:
      "Process documents, generate semantic embeddings, and store document content and associated metadata.",
    icon: faDatabase,
  },
  {
    title: "2. Clustering",
    description:
      "Automatically group semantically similar documents to discover relationships and recurring themes.",
    icon: faLayerGroup,
  },
  {
    title: "3. Labelling",
    description:
      "Use LLMs to generate descriptive labels for clusters, making automatically discovered groups easier to understand.",
    icon: faTag,
  },
  {
    title: "4. Collections",
    description:
      "Organise and manage documents through collections, combining automatic clustering with manual tagging.",
    icon: faFolderOpen,
  },
];
