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
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      setScrolled(scrollPosition > 20);
      setInHeroSection(scrollPosition < heroHeight);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine navbar style based on scroll position and page
  const isHomePage = currentPage === 'home';
  const isSolidWhite = !inHeroSection || !isHomePage;
  const isGlassEffect = isHomePage && scrolled && inHeroSection;

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isSolidWhite 
        ? 'bg-white shadow-md py-2' 
        : isGlassEffect 
        ? 'bg-white/5 backdrop-blur-lg py-2' 
        : 'bg-transparent py-2'
    }`}>
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Image
              src="/images/web/logo-smkn1-ciamis.png"
              alt="SMK NEGERI 1 CIAMIS Logo"
              width={32}
              height={32}
              priority
              className="object-contain"
            />
            <div className={`text-xs font-bold leading-tight ${isSolidWhite ? 'text-gray-900' : 'text-white'}`}>
              <div>SMKN 1</div>
              <div>CIAMIS</div>
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
        <div className="xl:hidden bg-white shadow-lg animate-in slide-in-from-top duration-300">
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


