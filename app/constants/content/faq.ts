export const faqData = [
  {
    question: "What is Sereleum and how does it help businesses?",
    answer: [
      "Sereleum is a prompt analytics platform that turns user prompts into actionable insights.",
      "It uncovers semantic patterns, optimizes workflows, and enables businesses to manage LLM usage efficiently."
    ],
  },
  {
    question: "How does Sereleum cluster prompts?",
    answer: [
      "Sereleum automatically groups semantically similar prompts and labels clusters to surface dominant user intents and workflows.",
      "This helps identify repeatable, high-value use cases suitable for standardization."
    ],
  },
  {
    question: "What is the benefit of tracking token usage by cluster?",
    answer: [
      "Tracking token consumption and cost at the use-case level highlights which clusters drive the most computational spend.",
      "Focusing on the top 5 clusters captures the highest-impact intents while reducing noise and overhead."
    ],
  },
  {
    question: "How does Sereleum help optimize prompts and templates?",
    answer: [
      "Sereleum identifies clusters where prompts can be standardized into templates.",
      "Templates reduce variance, improve output quality, and lower token usage by constraining unnecessary verbosity."
    ],
  },
  {
    question: "Can Sereleum measure the impact of prompt templates?",
    answer: [
      "Yes, Sereleum tracks token usage, prompt length, and cluster shifts before and after introducing templates.",
      "This creates a feedback loop from observation → intervention → measurement."
    ],
  },
  {
    question: "How can Sereleum help reduce LLM costs?",
    answer: [
      "By surfacing expensive clusters and suggesting prompt templates, Sereleum enables targeted cost optimization without degrading output quality."
    ],
  },
  {
    question: "What use cases can Sereleum support?",
    answer: [
      "Use case segmentation and discoverability to understand dominant workflows.",
      "Prompt template optimization to reduce effort and improve outputs.",
      "System prompt refinement to align AI behavior with actual user demand.",
      "Turning repeated free-form prompts into structured product workflows."
    ],
  },
  {
    question: "Which model does Sereleum use and why?",
    answer: [
      "Sereleum uses the MiniLM-6 quant ONNX model with a max token length of 512.",
      "This improves clustering accuracy by preserving context in longer prompts, even though it increases indexing time by up to 4×."
    ],
  },
  {
    question: "Why is clustering accuracy prioritized over processing speed?",
    answer: [
      "Accurate clustering ensures meaningful insights, which are the core value of Sereleum.",
      "Even if longer token lengths increase processing time, the resulting clusters allow for better template discovery and cost optimization."
    ],
  },
];
