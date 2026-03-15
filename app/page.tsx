import { Suspense } from 'react';
import Link from 'next/link';
import { Features, FlowDiagramSteps, HowItWorksSteps } from './constants/content/hero';
import { FeatureCard } from './ui/landing/features';
import { FlowDiagram } from './ui/landing/flow-diagram';
import { Card } from './ui/cards/card';
import { SectionItem } from './types';
import { GradientWave } from './ui/background/waves';

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
      <HowItWorksSection steps={HowItWorksSteps}/>
    </div>
  );
}

import Image from "next/image";

const HeroSection = () => {
  const stage = process.env.NEXT_PUBLIC_APP_STAGE;
  const mainCTA = stage === "mvp" ? "Get Free Report" : "Analyse Prompts";

  return (
    <section className="relative w-full min-h-[100dvh] pt-24 lg:pt-0 flex flex-col items-center justify-center px-4 overflow-x-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="relative z-10 w-full max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">

          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <span className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                Early Access
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-snug sm:leading-tight">
              Turn LLM prompts into{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400">
                actionable insights
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-medium text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Analyse user prompts, uncover semantic patterns, and optimize your
              LLM-powered products.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Link
                href="/dashboard"
                className="relative inline-flex items-center justify-center px-6 sm:px-8 py-4 font-semibold rounded-xl bg-indigo-600 text-white shadow-2xl hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-300"
              >
                {mainCTA}
              </Link>
            </div>

            <span className="text-xs text-gray-500 block">
              Free report available during Early Access
            </span>
          </div>

          <div className="relative w-full lg:w-3/5 flex justify-center lg:justify-end">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 opacity-20 blur-3xl rounded-3xl" />
            <div className="relative bg-white/80 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-gray-200 p-2 w-full border-2 border-indigo-500/30">
              <Image
                src="/screenshots/dashboard-page.png"
                alt="Sereleum dashboard preview"
                width={1600}
                height={1000}
                priority
                className="rounded-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="absolute inset-0 overflow-hidden z-0">
        <GradientWave opacity={0.06} />
        <GradientWave flip opacity={0.02} />
      </div> */}
    </section>
  );
};

const FeaturesSection = () => (
  <section className="w-full flex flex-col py-24 bg-gray-50 relative">
    <div className="max-w-4xl mx-auto px-6 text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
        Built for Prompt Intelligence
      </h2>
      <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
        Learn how Sereleum can help you enhance your LLM products.
      </p>
    </div>

    <div className="relative">
      {Features.map((feat, index) => (
        <FeatureCard
          key={index}
          title={feat.title}
          description={feat.description}
          image={feat.image}
          reverse={index % 2 === 0}
        />
      ))}
    </div>
  </section>
);



export const HowItWorksSection = ({ steps }: { steps: SectionItem[] }) => {
  return (
    <section className="flex flex-col w-full py-24 items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
          How Sereleum works
        </h2>
        <p className="text-lg md:text-xl text-gray-500">
          Index. Cluster. Label.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <Card key={idx} title={step.title} description={step.description} index={idx} icon={step.icon}/>
          ))}
        </div>
      </div>
    </section>
  );
};