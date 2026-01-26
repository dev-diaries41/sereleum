'use client'
import React, { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';

export default function Faq({ faq }: { faq: { question: string; answer: string[] }[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <div className="flex flex-col text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Still have questions?
          </h2>
        </div>

        <ul className="flex flex-col gap-4">
          {faq.map((item, index) => (
            <li
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-gray-900 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-indigo-50"
                aria-expanded={expandedIndex === index}
                onClick={() => handleToggle(index)}
              >
                <span className="flex-1 text-lg md:text-lg">{item.question}</span>
                <FontAwesomeIcon
                  icon={expandedIndex === index ? faChevronUp : faChevronDown}
                  className="w-5 h-5 ml-4 text-indigo-600"
                />
              </button>

              <AnimatePresence initial={false}>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed space-y-2">
                      {item.answer.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
