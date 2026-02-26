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
    <>
      {/* Instagram Feed */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="elfsight-app-24942526-708c-4173-9c49-83d440cb96f5" 
            data-elfsight-app-lazy
          />
        </div>
      </section>

      {/* TikTok Feed */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="elfsight-app-b32e4e66-7fdd-4148-aaae-cf0c5f30bf39" 
            data-elfsight-app-lazy
          />
        </div>
      </section>
    </>
  );
};

export default SocialFeeds;
