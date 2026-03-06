
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Users, Trophy, BookOpen, ExternalLink } from 'lucide-react';
import { PageType } from '../App';

interface HeroProps {
  onNavigate?: (page: PageType) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });

      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
    }
  }, []);

  const stats = [
    { icon: GraduationCap, value: '2,500+', label: 'Siswa Aktif' },
    { icon: Users, value: '150+', label: 'Guru & Staff' },
    { icon: Trophy, value: '100+', label: 'Prestasi' },
    { icon: BookOpen, value: '9', label: 'Program Keahlian' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload"
      >
        <source src="https://videos.pexels.com/video-files/5200358/5200358-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/5200358/5200358-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20" />

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
              {/* Heading */}
              <div className="space-y-5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                  Membangun Generasi Unggul & Berkarakter
                </h1>
                <p className="text-base text-white/90 max-w-xl leading-relaxed">
                  Temukan informasi tentang SMK Negeri 1 Ciamis, program keahlian, dan prestasi siswa kami
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <p className="text-white/80 text-sm font-medium">Akses Cepat</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => onNavigate?.('news')}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    Berita
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onNavigate?.('campus')}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    Virtual Tour
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onNavigate?.('alumni')}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    Alumni
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onNavigate?.('events')}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    Agenda
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Unified Stats Card */}
            <div className={`hidden lg:flex justify-end transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0268ab] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">SMK Negeri 1 Ciamis</h3>
                    <p className="text-white/70 text-xs">Sekolah Pusat Keunggulan</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-2.5 rounded-lg bg-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <stat.icon className="w-3.5 h-3.5 text-[#0268ab]" />
                        <div className="text-white/50 text-[10px]">{stat.label}</div>
                      </div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Info Tambahan */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                    <span className="text-white/60 text-xs">Akreditasi</span>
                    <span className="text-white text-xs font-bold">A (Unggul)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-white/60 text-xs">Kurikulum</span>
                    <span className="text-white text-xs font-medium">Merdeka</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar - Mobile */}
        <div className={`lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-md transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-[#0268ab]" />
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{stat.value}</div>
                    <div className="text-white/50 text-[10px]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


