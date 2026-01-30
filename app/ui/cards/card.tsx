'use client'
import { motion } from 'framer-motion';
import { SectionItem } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

interface CardProps extends SectionItem {
  index: number; // for staggered animation
  children?: ReactNode
}

export const Card = ({ title, description, index, icon, children }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="flex flex-col items-center md:items-start text-center md:text-left p-6 border border-gray-300 min-h-[200px] max-w-[400px] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      {icon && (
        <FontAwesomeIcon
        icon={icon}
        className='my-2 text-indigo-600 w-6, h-6'
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {children}
    </motion.div>
  );
};
