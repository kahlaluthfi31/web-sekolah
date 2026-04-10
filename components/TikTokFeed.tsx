'use client';

import React from 'react';

const TIKTOK_URL = 'https://www.tiktok.com/@smkn1ciamis';

const TikTokFeed: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Feed TikTok otomatis sementara dinonaktifkan karena limit tampilan widget eksternal tercapai.
          </p>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Buka TikTok Resmi
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokFeed;
