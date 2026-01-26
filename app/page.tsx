import { Suspense } from 'react';
import Link from 'next/link';
import { Features, UseCases } from './constants/content/hero';
import { FeatureCard } from './ui/landing/features';
import { FlowDiagram } from './ui/landing/flow-diagram';
import { motion } from "framer-motion"
import Image from 'next/image';
import { UseCaseCard } from './ui/landing/usecase';
import Faq from './ui/common/faq';
import { faqData } from './constants/content/faq';

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
    <div className="w-full overflow-hidden font-sans">
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection/>
      <Faq faq={faqData}/>
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="relative z-10 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          Turn LLM prompts into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400">
            actionable insights
          </span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-gray-700 mb-12 max-w-3xl mx-auto">
          Analyse real user prompts, uncover semantic patterns, and optimize LLM-powered products with clarity and control.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/dashboard"
            className="relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl bg-indigo-600 text-white shadow-2xl hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-300"
          >
            Analyse Prompts
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-transform duration-300"
          >
            Learn How It Works
          </Link>
        </div>

        <FlowDiagram />
      </div>

      {/* subtle urban accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-72 h-72 bg-purple-200/20 rounded-full absolute -top-20 -left-32 animate-pulse-slow"></div>
        <div className="w-96 h-96 bg-indigo-200/10 rounded-full absolute bottom-0 right-0 animate-spin-slow"></div>
      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="w-full flex flex-col py-24 bg-gray-50 relative">
    <div className="max-w-4xl mx-auto px-6 text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
        Built for Prompt Intelligence
      </h2>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Sereleum delivers deep visibility into prompt behavior across LLM systems, helping businesses make data-driven decisions and optimize AI outputs.
      </p>
    </div>

    <div className="relative">
      {Features.map((feat, index) => (
        <FeatureCard
          key={index}
          title={feat.title}
          description={feat.description}
          image={feat.image}
          reverse={index % 2 === 1}
          // className="hover:scale-[1.03] transition-transform duration-300"
        />
      ))}

      {/* urban accent shapes */}
      <div className="absolute -top-32 -left-24 w-64 h-64 bg-indigo-100/20 rounded-xl rotate-12 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100/15 rounded-xl -rotate-6 animate-spin-slow"></div>
    </div>
  </section>
);


const UseCasesSection = () => (
  <section className="w-full flex flex-col py-24 bg-white relative">
    <div className="max-w-4xl mx-auto px-6 text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
        How You Could Leverage Sereleum      
        </h2>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Turn insights from your LLM prompts into measurable business outcomes.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6">
  {UseCases.map((uc, idx) => (
    <UseCaseCard
      key={idx}
      index={idx}
      title={uc.title}
      description={uc.description}
      image={uc.image}
    />
  ))}
</div>

  </section>
);
