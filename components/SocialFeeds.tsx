'use client';

import React from 'react';
import Image from 'next/image';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/smkn1ciamis',
  tiktok: 'https://www.tiktok.com/@smkn1ciamis',
};

const SocialFeeds: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Social Media
          </span>
          <span className="text-xs text-gray-400">06 / 08</span>
        </div>
        
        <div className="flex flex-col divide-y divide-gray-200">
          {/* Instagram Feed */}
          <div className="py-6 w-full">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center mr-3">
                <Image
                  src="/icons/instagram.svg" 
                  alt="Instagram" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Instagram</h3>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600 mb-4">
                Feed otomatis sementara dinonaktifkan untuk menghindari limit dari provider widget.
              </p>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[#E1306C] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Lihat Instagram Resmi
              </a>
            </div>
          </div>

          {/* TikTok Feed */}
          <div className="py-6 w-full">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center mr-3">
                <Image
                  src="/icons/tiktok.svg" 
                  alt="TikTok" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">TikTok</h3>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600 mb-4">
                Feed otomatis sementara dinonaktifkan untuk menghindari limit dari provider widget.
              </p>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Lihat TikTok Resmi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeeds;
