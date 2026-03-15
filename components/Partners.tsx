'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  orderPosition: number;
  isActive: boolean;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [slideOffset, setSlideOffset] = useState<number | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);

  const shouldAnimate = partners.length > 4;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners?active=true&limit=100');
        const json = await res.json();
        if (json.success) {
          setPartners(json.data);
        }
      } catch {
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    if (!firstSetRef.current || !shouldAnimate) return;

    const measure = () => {
      if (firstSetRef.current) {
        // lebar satu set + gap antar set (gap-16 = 64px)
        setSlideOffset(firstSetRef.current.offsetWidth + 64);
      }
    };

    const raf = requestAnimationFrame(() => {
      measure();
    });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [partners, shouldAnimate]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slidePartners {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--slide-offset, 50%))); }
        }
        .partners-slider {
          animation: slidePartners 40s linear infinite;
        }
        .partners-slider:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />

      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Mitra Kerja Sama
            </span>
            <span className="text-xs text-gray-400">08 / 08</span>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className={`flex py-2 ${shouldAnimate ? 'partners-slider' : 'flex-wrap gap-16'}`}
                style={
                  shouldAnimate && slideOffset
                    ? {
                      width: 'max-content',
                      gap: '64px',
                      ['--slide-offset' as string]: `${slideOffset}px`,
                    }
                    : shouldAnimate
                      ? { width: 'max-content', gap: '64px' }
                      : undefined
                }
              >
                {/* Set pertama — diukur untuk dapat offset animasi yang tepat */}
                <div ref={firstSetRef} className="flex gap-16 items-center">
                  {partners.map((partner) => (
                    <div
                      key={`a-${partner.id}`}
                      className="flex-shrink-0 flex items-center justify-center w-32 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    >
                      {partner.logoUrl ? (
                        <div className="relative w-full h-14">
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            sizes="128px"
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">{partner.name}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Set kedua — hanya render saat animasi aktif */}
                {shouldAnimate && (
                  <div className="flex gap-16 items-center">
                    {partners.map((partner) => (
                      <div
                        key={`b-${partner.id}`}
                        className="flex-shrink-0 flex items-center justify-center w-32 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                      >
                        {partner.logoUrl ? (
                          <div className="relative w-full h-14">
                            <Image
                              src={partner.logoUrl}
                              alt={partner.name}
                              fill
                              sizes="128px"
                              className="object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
