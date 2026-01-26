'use client'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionItem } from '@/app/types';

interface UseCaseCardProps extends SectionItem {
  index: number; // for staggered animation
}

export const UseCaseCard = ({ title, description, image, index }: UseCaseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-6 bg-indigo-50/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      {image && (
        <Image
          src={image}
          width={120}
          height={120}
          alt={title}
          className="mb-4 rounded-xl"
        />
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 font-medium">{description}</p>
    </motion.div>
  );
};
