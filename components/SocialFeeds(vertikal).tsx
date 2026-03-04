"use client";

import React, { useEffect } from "react";

const SocialFeeds: React.FC = () => {
  useEffect(() => {
    // Load Elfsight script if not already loaded
    const scriptId = "elfsight-platform";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top label row */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Media Sosial
            </span>
            <span className="text-xs text-gray-400">04 / 08</span>
          </div>

          {/* Instagram Feed */}
          <section className=" bg-gray-50 overflow-hidden">
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
        </div>
      </section>
    </>
  );
};

export default SocialFeeds;
