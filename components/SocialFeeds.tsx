'use client';

import React, { useEffect } from 'react';

const SocialFeeds: React.FC = () => {
  useEffect(() => {
    // Load Elfsight script if not already loaded
    const scriptId = 'elfsight-platform';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Social Media
          </span>
          <span className="text-xs text-gray-400">06 / 08</span>
        </div>
        
        <div className="flex flex-col space-y-8">
          {/* Instagram Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center mr-3">
                <img 
                  src="/icons/instagram.svg" 
                  alt="Instagram" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Instagram</h3>
            </div>
            <div 
              className="elfsight-app-24942526-708c-4173-9c49-83d440cb96f5" 
              data-elfsight-app-lazy
            />
          </div>

          {/* TikTok Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center mr-3">
                <img 
                  src="/icons/tiktok.svg" 
                  alt="TikTok" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">TikTok</h3>
            </div>
            <div 
              className="elfsight-app-b32e4e66-7fdd-4148-aaae-cf0c5f30bf39" 
              data-elfsight-app-lazy
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeeds;
