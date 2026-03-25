'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { PageType } from '../App';

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inHeroSection, setInHeroSection] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Set scrolled state untuk glass effect
      setScrolled(scrollPosition > 50);
      
      // Hero section detection - gunakan hero section yang lebih spesifik per halaman
      let heroHeight = window.innerHeight; // Default untuk landing page
      
      // Jika bukan landing page, gunakan hero section yang lebih kecil
      if (currentPage !== 'home') {
        // Hero section untuk halaman lain lebih kecil (sekitar 400px)
        heroHeight = 400;
      }
      
      setInHeroSection(scrollPosition < heroHeight);
      
      // Debug log
      console.log('Navbar Debug:', {
        currentPage,
        scrollPosition,
        heroHeight,
        inHeroSection: scrollPosition < heroHeight,
        scrolled: scrollPosition > 50
      });
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine navbar style based on scroll position
  // Logic: transparent di atas, glass saat scroll di hero, solid setelah lewati hero
  let navbarStyle = '';
  let isSolidWhite = false;
  
  if (inHeroSection && !scrolled) {
    // Transparent di hero section saat tidak di-scroll
    navbarStyle = 'bg-transparent py-2';
    isSolidWhite = false;
  } else if (inHeroSection && scrolled) {
    // Glass effect saat di-scroll dalam hero section
    navbarStyle = 'bg-white/10 backdrop-blur-lg shadow-lg py-2';
    isSolidWhite = false;
  } else {
    // Solid background setelah melewati hero section
    navbarStyle = 'bg-white shadow-md py-2';
    isSolidWhite = true;
  }
  
  // Debug log untuk navbar style
  console.log('Navbar Style:', {
    navbarStyle,
    isSolidWhite,
    inHeroSection,
    scrolled
  });

  const dropdownItems: { name: string; page: PageType }[] = [
    { name: 'Profil Sekolah', page: 'about-us' },
    // { name: 'Admissions', page: 'admissions' },
    { name: 'Struktur Sekolah', page: 'faculty' },
    { name: 'Sarana Prasarana', page: 'campus' },
  ];

  const mainNavItems: { name: string; page: PageType }[] = [
    { name: 'Beranda', page: 'home' },
    { name: 'Agenda', page: 'events' },
    { name: 'Berita', page: 'news' },
    { name: 'Siswa', page: 'students-life' },
    { name: 'Alumni', page: 'alumni' },
    // { name: 'News Details', page: 'news-details' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarStyle}`}>
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Image
              src="/images/web/logo-smkn1-ciamis.png"
              alt="SMK NEGERI 1 CIAMIS Logo"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
            <div className="flex flex-col">
              <div className={`text-sm font-bold leading-tight ${isSolidWhite ? 'text-gray-900' : 'text-white'}`}>
                SMKN 1 CIAMIS
              </div>
              <div className={`text-[10px] font-normal leading-tight tracking-[0.08em] ${isSolidWhite ? 'text-gray-600' : 'text-white/80'}`}>
                Provinsi Jawa Barat
              </div>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-6">
              <button onClick={() => onNavigate('home')} className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === 'home' && isSolidWhite ? 'text-[#0268ab]' : isSolidWhite ? 'text-gray-700' : 'text-white'}`}>Beranda</button>

              <div className="relative group" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-[#0268ab] ${isSolidWhite ? 'text-gray-700' : 'text-white'}`}
                >
                  Tentang Kami <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white">
                    <div className="py-1">
                      {dropdownItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            onNavigate(item.page);
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0268ab] transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mainNavItems.slice(1).map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === item.page && isSolidWhite ? 'text-[#0268ab]' : isSolidWhite ? 'text-gray-700' : 'text-white'}`}
                >
                  {item.name}
                </button>
              ))}

              <button
                onClick={() => onNavigate('contact')}
                className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === 'contact' && isSolidWhite ? 'text-[#0268ab]' : isSolidWhite ? 'text-gray-700' : 'text-white'}`}
              >
                Kontak
              </button>
            </div>
          </div>

          <div className="xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-md ${isSolidWhite ? 'text-gray-700' : 'text-white'}`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={`xl:hidden animate-in slide-in-from-top duration-300 ${
          isSolidWhite 
            ? 'bg-white shadow-lg' 
            : 'bg-white/95 backdrop-blur-lg shadow-2xl'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => (
              <button key={item.name} onClick={() => { onNavigate(item.page); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">{item.name}</button>
            ))}
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-3 py-1">About</p>
              {dropdownItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => { onNavigate(item.page); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#0268ab]"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button onClick={() => { onNavigate('contact'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">Kontak</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


