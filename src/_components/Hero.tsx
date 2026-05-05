'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { CarouselApi } from '@/components/ui/carousel';

const slides = [
  {
    id: 1,
    title: 'Fresh Products Delivered to your Door',
    subtitle: 'Get 20% off your first order',
    image: '/hero_bg.png',
    buttonText: 'Shop Now',
    buttonText2: 'Learn More',
  },
  {
    id: 2,
    title: 'Prime Quality, Guaranteed',
    subtitle: 'New arrivals every day — shop the latest trends',
    image: '/hero_bg.png',
    buttonText: 'Shop Now',
    buttonText2: 'View Deals',
  },
  {
    id: 3,
    title: 'Fast & free Delivery',
    subtitle: 'Same day delivery available',
    image: '/hero_bg.png',
    buttonText: 'Order Now',
    buttonText2: 'Delivery Info',
  },
];

export default function Hero() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      {/* Carousel */}
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full relative"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full overflow-hidden" style={{ height: '400px' }}>
                {/* Background Image */}
                <div className='h-full flex items-center justify-center'>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full  bg-center bg-cover"
                />
                </div>

                {/* Green Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-green-500/90 to-green-400/50" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-12">
                  <h1 className="text-2xl select-none  sm:text-3xl lg:text-4xl font-bold text-white max-w-sm leading-tight mb-3 drop-shadow">
                    {slide.title}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base mb-6 select-none drop-shadow">
                    {slide.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/products"
                      className="bg-white text-green-600 font-semibold px-6 py-2 rounded-md hover:bg-green-50 transition-colors shadow"
                    >
                      {slide.buttonText}
                    </Link>
                    <Link
                      href="/deals"
                      className="border-2 border-slate-300 text-white font-semibold px-5 py-2 rounded-md hover:bg-white/10 transition-colors"
                    >
                      {slide.buttonText2}
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows — positioned over the slides */}
        <CarouselPrevious className="absolute left-3 hover:scale-105 top-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white border-0 shadow-md" />
        <CarouselNext className="absolute right-3 hover:scale-105 top-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white border-0 shadow-md" />

        {/* Custom Carousel Dots — centered bottom */}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all duration-300 ${
                index === current
                  ? 'w-8 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white rounded-full opacity-50 hover:opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </>
  );
}