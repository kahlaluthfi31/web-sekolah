
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
  const [videoSrc, setVideoSrc] = useState('/videos/hero-bg.mp4')
  const [heroText, setHeroText] = useState({
    title: 'Membangun Generasi Unggul & Berkarakter',
    subtitle: 'Temukan informasi tentang SMK Negeri 1 Ciamis, program keahlian, dan prestasi siswa kami',
  })
  const [heroStats, setHeroStats] = useState({
    schoolName: 'SMK Negeri 1 Ciamis',
    schoolTagline: 'Sekolah Pusat Keunggulan',
    activeStudents: '2,500+',
    teachersStaff: '150+',
    achievements: '100+',
    majors: '9',
    accreditation: 'A (Unggul)',
    curriculum: 'Merdeka',
  })

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setIsLoaded(false);

    const playVideo = () => {
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
        document.addEventListener('click', playVideo, { once: true });
      });
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
    video.load();
    playVideo();

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [videoSrc]);

  const formatCount = (n: number | null | undefined, fallback: string) => {
    if (typeof n !== 'number' || Number.isNaN(n)) return fallback
    if (n >= 1000) return `${Math.round(n / 100) / 10}k+`
    return `${n}+`
  }

  const stats = [
    { icon: GraduationCap, value: heroStats.activeStudents, label: 'Siswa Aktif' },
    { icon: Users, value: heroStats.teachersStaff, label: 'Guru & Staff' },
    { icon: Trophy, value: heroStats.achievements, label: 'Prestasi' },
    { icon: BookOpen, value: heroStats.majors, label: 'Program Keahlian' },
  ];

  useEffect(() => {
    // Fetch settings (hero texts, manual stats, school info)
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const json = await res.json()
        if (json.success) {
          const settings = json.data as { settingKey: string; settingValue: string | null }[]
          const getVal = (key: string) => settings.find(s => s.settingKey === key)?.settingValue || ''
          setHeroText({
            title: getVal('hero_title') || 'Membangun Generasi Unggul & Berkarakter',
            subtitle: getVal('hero_subtitle') || 'Temukan informasi tentang SMK Negeri 1 Ciamis, program keahlian, dan prestasi siswa kami',
          })
          setHeroStats(s => ({
            ...s,
            schoolName: getVal('site_name') || s.schoolName,
            schoolTagline: getVal('site_description') || s.schoolTagline,
            activeStudents: getVal('hero_active_students') || s.activeStudents,
            accreditation: getVal('hero_accreditation') || s.accreditation,
            curriculum: getVal('hero_curriculum') || s.curriculum,
          }))
        }
      } catch (err) {
        console.error('Failed to load settings', err)
      }
    }

    // Fetch dynamic counts (teachers, majors, achievements)
    const loadCounts = async () => {
      try {
        const [teachersRes, majorsRes, achievementsRes] = await Promise.all([
          fetch('/api/teachers?limit=1'),
          fetch('/api/majors?limit=1'),
          fetch('/api/achievements?limit=1'),
        ])

        const [teachersJson, majorsJson, achievementsJson] = await Promise.all([
          teachersRes.json(), majorsRes.json(), achievementsRes.json(),
        ])

        setHeroStats(s => ({
          ...s,
          teachersStaff: formatCount(teachersJson?.pagination?.total, s.teachersStaff),
          majors: formatCount(majorsJson?.pagination?.total, s.majors),
          achievements: formatCount(achievementsJson?.pagination?.total, s.achievements),
        }))
      } catch (err) {
        console.error('Failed to load counts', err)
      }
    }

    loadSettings()
    loadCounts()
  }, [])

  // Update video src when settings loaded
  useEffect(() => {
    const fetchVideoSetting = async () => {
      try {
        const res = await fetch('/api/settings')
        const json = await res.json()
        if (json.success) {
          const settings = json.data as { settingKey: string; settingValue: string | null }[]
          const heroVideo = settings.find(s => s.settingKey === 'hero_video_url')?.settingValue
          if (heroVideo) setVideoSrc(heroVideo)
        }
      } catch (err) {
        console.error('Failed to load hero video setting', err)
      }
    }
    fetchVideoSetting()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video 
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload"
          crossOrigin="anonymous"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      
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
                  {heroText.title}
                </h1>
                <p className="text-base text-white/90 max-w-xl leading-relaxed">
                  {heroText.subtitle}
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
                    <h3 className="text-white font-semibold text-base">{heroStats.schoolName}</h3>
                    <p className="text-white/70 text-xs">{heroStats.schoolTagline}</p>
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
                    <span className="text-white text-xs font-bold">{heroStats.accreditation}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-white/60 text-xs">Kurikulum</span>
                    <span className="text-white text-xs font-medium">{heroStats.curriculum}</span>
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


