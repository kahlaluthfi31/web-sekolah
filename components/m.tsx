'use client';

import React from 'react';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/smkn1ciamis',
  tiktok: 'https://www.tiktok.com/@smkn1ciamis',
};

const SocialFeedsHorizontal: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Container for Instagram and TikTok - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Instagram Feed */}
          <div className="w-full">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram</h3>
              <p className="text-sm text-gray-600 mb-4">
                Widget feed dinonaktifkan sementara karena limit provider tercapai.
              </p>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[#E1306C] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Buka Instagram
              </a>
            </div>
          </div>

          {/* TikTok Feed */}
          <div className="w-full">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TikTok</h3>
              <p className="text-sm text-gray-600 mb-4">
                Widget feed dinonaktifkan sementara karena limit provider tercapai.
              </p>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Buka TikTok
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SocialFeedsHorizontal;
