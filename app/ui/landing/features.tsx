'use client'
import Image from 'next/image';
import { motion } from "framer-motion"
import { FeatureProps } from '@/app/types';

export const FeatureCard = ({
  title,
  description,
  image,
  reverse,
}: FeatureProps & { reverse?: boolean }) => (
  <section className="w-full py-20 max-w-7xl mx-auto px-6">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15 },
        },
      }}
      className={`flex flex-col md:flex-row items-center gap-16 ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Text */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: reverse ? 40 : -40 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full md:w-2/5 text-center md:text-left"
      >
        <h3 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-gray-900">
          {title}
        </h3>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
          {description}
        </p>
      </motion.div>

      {/* Image */}
      {image && (
        <motion.div
          variants={{
            hidden: { opacity: 0, x: reverse ? -40 : 40, scale: 0.95 },
            visible: { opacity: 1, x: 0, scale: 1 },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full md:w-3/5 flex justify-center"
        >
          <div className="w-100 h-100 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 flex items-center justify-center">
            <Image
              src={image}
              width={500}
              height={500}
              alt="feature"
              className="object-contain rounded-2xl"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  </section>
);
