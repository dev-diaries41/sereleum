import { Suspense } from 'react';
import Link from 'next/link';
import { Features } from './constants/content/hero';
import { FeatureCard } from './ui/landing/features';
import { FlowDiagram } from './ui/landing/flow-diagram';

export const revalidate = 3600;

export default async function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="relative z-10 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Turn LLM prompts into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
            actionable insights
          </span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-gray-600 mb-10">
          Analyse real user prompts, uncover semantic patterns, and optimise LLM-powered products with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link
            href="/dashboard"
            className="relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition"
          >
            Analyse prompts
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
          >
            Learn how it works
          </Link>
        </div>

        <FlowDiagram />
      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="w-full flex flex-col py-20 bg-gray-50">
    <div className="max-w-4xl mx-auto px-6 text-center mb-24">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
        Built for prompt intelligence
      </h2>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
        Sereleum provides deep visibility into how prompts behave across your LLM systems.
      </p>
    </div>

    {Features.map((feat, index) => (
      <FeatureCard
        key={index}
        title={feat.title}
        description={feat.description}
        image={feat.image}
        reverse={index % 2 === 1}
      />
    ))}
  </section>
);