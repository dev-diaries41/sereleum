import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faLayerGroup, faCoins, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export const FlowDiagram = () => {
  const steps = [
    { id: 1, title: 'Analyse prompts', icon: faChartLine },
    { id: 2, title: 'Understand user intent', icon: faLayerGroup },
    { id: 3, title: 'Optimise system prompts & product', icon: faCoins },
    { id: 4, title: 'Better UX & outcomes', icon: faShieldHalved },
  ];

  return (
    <div className="mt-8">
      {/* Horizontal on md+, vertical on small screens */}
      <div className="hidden md:flex items-center justify-center gap-6">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-indigo-600">
                <FontAwesomeIcon icon={step.icon} className="text-2xl" />
              </div>
              <div className="text-sm font-medium text-gray-700">{step.title}</div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex items-center">
                <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M0 12H52" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M44 4L52 12L44 20" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="md:hidden flex flex-col items-center gap-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-3 w-full">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-indigo-600">
              <FontAwesomeIcon icon={step.icon} className="text-2xl" />
            </div>
            <div className="text-sm font-medium text-gray-700 text-center px-4">{step.title}</div>

            {idx < steps.length - 1 && (
              <div className="w-px h-6 bg-indigo-100" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500 max-w-xl mx-auto">
        <span className="font-medium">Outcome:</span> Use real prompt signals to iterate on prompts and product flows that measurably improve user experience and reduce cost.
      </div>
    </div>
  );
};
