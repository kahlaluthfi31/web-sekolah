'use client';

import React from 'react';
import { Building2, Factory, Store, ShoppingBag, Briefcase, Home, Building, Warehouse } from 'lucide-react';

const Partners: React.FC = () => {
  // Temporary icons as logo placeholders
  const partners = [
    { icon: Building2, name: "PT Indo Karya" },
    { icon: Factory, name: "Maju Manufaktur" },
    { icon: Store, name: "Retail Nusantara" },
    { icon: ShoppingBag, name: "Bisnis Group" },
    { icon: Briefcase, name: "Profesional Corp" },
    { icon: Home, name: "Properti Indonesia" },
    { icon: Building, name: "Konstruksi Prima" },
    { icon: Warehouse, name: "Logistik Jaya" },
  ];

  // Duplicate the array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slidePartners {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .partners-slider {
          animation: slidePartners 30s linear infinite;
        }
        .partners-slider:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top label row */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Mitra Kerja Sama</span>
            <span className="text-xs text-gray-400">05 / 05</span>
          </div>

          {/* Logo Slider */}
          <div className="relative">
            <div className="overflow-hidden">
              <div className="partners-slider flex gap-16 items-center">
                {duplicatedPartners.map((partner, index) => {
                  const IconComponent = partner.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex-shrink-0 flex items-center justify-center w-32 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    >
                      <IconComponent className="w-16 h-16 text-gray-400" strokeWidth={1} />
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Partners;
