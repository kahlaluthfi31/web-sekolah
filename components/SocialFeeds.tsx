'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

const SocialFeeds: React.FC = () => {
  const elfsightEnabled = process.env.NEXT_PUBLIC_ELFSIGHT_ENABLED === 'true'

  useEffect(() => {
    if (!elfsightEnabled) return
    const scriptId = 'elfsight-platform'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://elfsightcdn.com/platform.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [elfsightEnabled])

  if (!elfsightEnabled) {
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
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <div className="flex items-center mb-3">
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
              <p className="text-sm text-gray-500">
                Embed dimatikan sementara (batas tampilan tercapai). Ikuti kami langsung di Instagram.
              </p>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-white bg-[#0268ab] hover:bg-[#01588f] rounded-lg transition-colors"
              >
                Buka Instagram
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <div className="flex items-center mb-3">
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
              <p className="text-sm text-gray-500">
                Embed dimatikan sementara (batas tampilan tercapai). Ikuti kami langsung di TikTok.
              </p>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-white bg-[#0268ab] hover:bg-[#01588f] rounded-lg transition-colors"
              >
                Buka TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
            <div
              className="elfsight-app-24942526-708c-4173-9c49-83d440cb96f5"
              data-elfsight-app-lazy
            />
          </div>

          {/* TikTok Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
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
            <div
              className="elfsight-app-b32e4e66-7fdd-4148-aaae-cf0c5f30bf39"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialFeeds
