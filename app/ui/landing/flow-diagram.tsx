'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faLayerGroup, faCoins, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { SectionItem } from '@/app/types';

export const FlowDiagram = ({steps}: {steps: Partial<SectionItem>[]}) => {

const trackRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);

  // px per second
  const SPEED = 80;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      setWidth(el.scrollWidth / 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

 useAnimationFrame((_, delta) => {
  if (!width) return;

  const moveBy = (SPEED * delta) / 1000;
  const next = x.get() + moveBy;

  // modulo wrap — continuous, no reset
  x.set(next >= 0 ? next - width : next);
});


  return (
    <div className="mt-10 overflow-hidden">
      <div className="relative w-full">
        <motion.div ref={trackRef} className="flex w-max" style={{ x }}>
          {[...steps, ...steps].map((step, idx) => (
            <div key={`${step.title}-${idx}`} className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-300 shadow-sm flex items-center justify-center text-indigo-600">
                  {step.icon &&<FontAwesomeIcon icon={step.icon} className="w-6 h-6" />}
                </div>
                <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {step.title}
                </div>
              </div>

              <svg
                width="64"
                height="24"
                viewBox="0 0 64 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M0 12H52" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
                <path d="M44 4L52 12L44 20" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6 text-xs text-gray-500 max-w-xl mx-auto text-center">
        <span className="font-medium">Outcome:</span> Use real prompt signals to iterate on prompts and product flows that measurably improve user experience and reduce cost.
      </div>
    </div>
  );
};
