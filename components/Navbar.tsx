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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  const isNavMaroon = scrolled || currentPage !== 'home';

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isNavMaroon ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Image 
              src="/images/web/logo-smea-lama.png" 
              alt="SMK NEGERI 1 CIAMIS Logo" 
              width={180}
              height={54}
              priority
            />
            {/* <h1 className="text-white">SMEA</h1> */}
          </div>
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-6">
              <button onClick={() => onNavigate('home')} className={`text-sm font-medium transition-colors hover:text-[#0092DD] ${currentPage === 'home' && isNavMaroon ? 'text-[#0092DD]' : isNavMaroon ? 'text-gray-700' : 'text-white'}`}>Home</button>
              
              <div className="relative group" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-[#0092DD] ${isNavMaroon ? 'text-gray-700' : 'text-white'}`}
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
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0092DD] transition-colors"
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
                  className={`text-sm font-medium transition-colors hover:text-[#0092DD] ${currentPage === item.page && isNavMaroon ? 'text-[#0092DD]' : isNavMaroon ? 'text-gray-700' : 'text-white'}`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="flex items-center space-x-4 ml-6">
                <button 
                  onClick={() => onNavigate('contact')}
                  className={`text-sm font-medium transition-colors hover:text-[#0092DD] ${isNavMaroon ? 'text-gray-700' : 'text-white'}`}
                >
                  Kontak
                </button>
                <button className="bg-[#0092DD] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0092DD] transition-all duration-300 shadow-lg">
                  Login
                </button>
              </div>
            </div>
          </div>

          <div className="xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-md ${isNavMaroon ? 'text-gray-700' : 'text-white'}`}>
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
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#0092DD]"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button onClick={() => { onNavigate('contact'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">Kontak</button>
            <button className="w-full text-center bg-[#0092DD] text-white px-3 py-2 rounded-md text-base font-medium">Apply Now</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


