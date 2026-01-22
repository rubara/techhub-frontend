'use client';

// TechHub.bg - Hero Slider Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSlide } from '@/types';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { getImageUrl } from '@/lib/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/Icons';

interface HeroSliderProps {
  slides: HeroSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useUIStore();

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[450px] bg-gradient-to-br from-[#101720] to-[#1B3627] flex items-center justify-center">
        <div className="text-center text-white/30">
          <span className="text-5xl block mb-4">🖼️</span>
          <span>Slider Images from Admin Panel<br/>(1920 x 600 recommended)</span>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const imageUrl = getImageUrl(slide.image);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-[450px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101720] to-[#1B3627]">
        {/* Placeholder for missing images */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 text-sm">
          <span className="text-5xl mb-3">🖼️</span>
          <span>Slider Image from Admin Panel</span>
        </div>
      </div>
      
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex items-center">
        <div className="max-w-[600px]">
          <h1 
            className="font-['Russo_One'] text-5xl md:text-[52px] text-white mb-4 leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {language === 'bg' ? slide.titleBg : slide.titleEn}
          </h1>
          <p 
            className="text-lg text-white/85 mb-7"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
          >
            {language === 'bg' ? slide.subtitleBg : slide.subtitleEn}
          </p>
          <Link
            href={slide.buttonLink || '#'}
            className="inline-block px-9 py-4 rounded-lg font-['Russo_One'] text-[15px] text-white transition-transform hover:scale-105"
            style={{ 
              backgroundColor: slide.buttonColor || colors.forestGreen,
              boxShadow: `0 4px 20px ${slide.buttonColor || colors.forestGreen}60`,
            }}
          >
            {language === 'bg' ? slide.buttonTextBg : slide.buttonTextEn}
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-2.5 rounded-full transition-all duration-300
                ${currentSlide === index 
                  ? 'w-7 bg-[#00B553]' 
                  : 'w-2.5 bg-white/40 hover:bg-white/60'
                }
              `}
            />
          ))}
        </div>
      )}

      {/* Arrow Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 border-2 border-white/30 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 border-2 border-white/30 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <ChevronRightIcon size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
