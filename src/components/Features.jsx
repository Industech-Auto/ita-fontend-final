import React from 'react';
import Carousel from './sub_comp/Carousel';
import { motion } from 'framer-motion';

// This component correctly accepts and uses paragraphText
function Features({ title, mainImage, carouselImages, paragraphText }) {
  return (
    <div className='w-screen overflow-x-clip h-auto box-border flex flex-col items-center justify-center py-8 px-4 gap-4'>

      <h1 className='text-3xl poppins-extrabold gd-text'>
        {title}
      </h1>

      <motion.div 
        className='relative overflow-hidden rounded-md flex-grow w-[95vw] lg:max-h-[75vh]'
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: false, amount: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={mainImage}
          alt={`Main visual for ${title}`}
          className='w-full h-full object-cover'
        />

        <motion.div 
          className='absolute inset-0 flex items-center justify-center p-8 bg-black/80'
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
            hover: { opacity: 0, scale: 0.9 }
          }}
        >
          {/* It's displayed right here */}
          <p className='text-white text-center text-sm md:text-xl lg:max-w-prose poppins-semibold'>
            {paragraphText}
          </p>
        </motion.div>
      </motion.div>

      <div className='w-[95vw] md:w-[95vw] overflow-hidden box-border'>
        <Carousel images={carouselImages} />
      </div>

    </div>
  );
}

export default Features;