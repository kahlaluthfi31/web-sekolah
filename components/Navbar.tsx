"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { PageType } from "../App";
import { signOut, useSession } from "next-auth/react";

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  currentPage: string;
}

type MajorOption = {
  id: number;
  name: string;
  competencies: { id: number; name: string }[];
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { status: sessionStatus } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inHeroSection, setInHeroSection] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProgramsDropdown, setShowProgramsDropdown] = useState(false);
  const [majors, setMajors] = useState<MajorOption[]>([]);
  const [loadingMajors, setLoadingMajors] = useState(true);
  const [bludUrl, setBludUrl] = useState<string | null>(
    process.env.NEXT_PUBLIC_BLUD_URL || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const programDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Set scrolled state untuk glass effect
      setScrolled(scrollPosition > 50);

      // Hero section detection - gunakan hero section yang lebih spesifik per halaman
      let heroHeight = window.innerHeight; // Default untuk landing page

      // Jika bukan landing page, tentukan hero height berdasarkan page type
      if (currentPage !== "home") {
        // Pages dengan detail content (news-details, dll) punya header lebih besar
        if (currentPage === "news-details") {
          // For detail pages with larger header
          heroHeight = 500;
        } else {
          // Hero section untuk halaman lain lebih kecil (sekitar 400px)
          heroHeight = 400;
        }
      }

      setInHeroSection(scrollPosition < heroHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
      if (
        programDropdownRef.current &&
        !programDropdownRef.current.contains(target)
      ) {
        setShowProgramsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await fetch("/api/majors/list");
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setMajors(json.data);
        }
      } catch {
        // ignore
      } finally {
        setLoadingMajors(false);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    const fetchBlud = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          const found = json.data.find(
            (s: { settingKey: string; settingValue?: string | null }) =>
              s.settingKey === 'blud_url'
          );
          const settingValue = found?.settingValue?.trim();
          if (settingValue) {
            setBludUrl(settingValue);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchBlud();
  }, []);

  const scrollToPrograms = () => {
    onNavigate("program-keahlian");
    setIsOpen(false);
    setShowDropdown(false);
    setShowProgramsDropdown(false);
  };

  // Determine navbar style based on scroll position
  // Logic: transparent di atas, glass saat scroll di hero, solid setelah lewati hero
  let navbarStyle = "";
  let isSolidWhite = false;

  if (inHeroSection && !scrolled) {
    // Transparent di hero section saat tidak di-scroll
    navbarStyle = "bg-transparent py-2";
    isSolidWhite = false;
  } else if (inHeroSection && scrolled) {
    // Glass effect saat di-scroll dalam hero section
    navbarStyle = "bg-white/10 backdrop-blur-lg shadow-lg py-2";
    isSolidWhite = false;
  } else {
    // Solid background setelah melewati hero section
    navbarStyle = "bg-white shadow-md py-2";
    isSolidWhite = true;
  }

  // Debug log untuk navbar style
  console.log("Navbar Style:", {
    navbarStyle,
    isSolidWhite,
    inHeroSection,
    scrolled,
  });

  const dropdownItems: { name: string; page: PageType }[] = [
    { name: "Profil Sekolah", page: "about-us" },
    // { name: 'Admissions', page: 'admissions' },
    { name: "Struktur Sekolah", page: "faculty" },
    { name: "Sarana Prasarana", page: "campus" },
  ];

  const mainNavItems: { name: string; page: PageType }[] = [
    { name: "Beranda", page: "home" },
    { name: "Agenda", page: "events" },
    { name: "Berita", page: "news" },
    { name: "Siswa", page: "students-life" },
    { name: "Alumni", page: "alumni" },
    // { name: 'News Details', page: 'news-details' },
  ];

  const handleMainNavClick = (page: PageType) => {
    if (page === "news") {
      if (typeof window !== "undefined") {
        window.location.href = "/berita";
      }
      return;
    }
    onNavigate(page);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${navbarStyle}`}
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div
            className="shrink-0 flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <Image
              src="/images/web/logo-smkn1-ciamis.png"
              alt="SMK NEGERI 1 CIAMIS Logo"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
            <div className="flex flex-col">
              <div
                className={`text-sm font-bold leading-tight ${isSolidWhite ? "text-gray-900" : "text-white"}`}
              >
                SMKN 1 CIAMIS
              </div>
              <div
                className={`text-[10px] font-normal leading-tight tracking-[0.08em] ${isSolidWhite ? "text-gray-600" : "text-white/80"}`}
              >
                Provinsi Jawa Barat
              </div>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-6">
              <button
                onClick={() => onNavigate("home")}
                className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === "home" && isSolidWhite ? "text-[#0268ab]" : isSolidWhite ? "text-gray-700" : "text-white"}`}
              >
                Beranda
              </button>

              <div className="relative group" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-[#0268ab] ${isSolidWhite ? "text-gray-700" : "text-white"}`}
                >
                  Tentang Kami{" "}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
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

              <div className="relative" ref={programDropdownRef}>
                <button
                  onClick={() => setShowProgramsDropdown(!showProgramsDropdown)}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-[#0268ab] ${isSolidWhite ? "text-gray-700" : "text-white"}`}
                >
                  Program Keahlian{" "}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${showProgramsDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showProgramsDropdown && (
                  <div className="absolute left-0 mt-2 w-[18rem] rounded-md shadow-lg bg-white border border-gray-200 z-50">
                    <div className="py-1 overflow-visible">
                      {loadingMajors && (
                        <p className="px-4 py-3 text-sm text-gray-400">
                          Memuat...
                        </p>
                      )}
                      {!loadingMajors && majors.length === 0 && (
                        <p className="px-4 py-3 text-sm text-gray-400">
                          Belum ada data program
                        </p>
                      )}
                      {!loadingMajors &&
                        majors.map((major) => (
                          <button
                            key={major.id}
                            onClick={scrollToPrograms}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-[#e8f2ff] hover:text-[#0268ab] transition-colors"
                          >
                            {major.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {mainNavItems.slice(1).map((item) => (
                <React.Fragment key={item.name}>
                  <button
                    onClick={() => handleMainNavClick(item.page)}
                    className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === item.page && isSolidWhite ? "text-[#0268ab]" : isSolidWhite ? "text-gray-700" : "text-white"}`}
                  >
                    {item.name}
                  </button>
                  {item.page === "students-life" && bludUrl && (
                    <a
                      href={bludUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${isSolidWhite ? "text-gray-700" : "text-white"}`}
                    >
                      BLUD
                    </a>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={() => onNavigate("contact")}
                className={`text-sm font-medium transition-colors hover:text-[#0268ab] ${currentPage === "contact" && isSolidWhite ? "text-[#0268ab]" : isSolidWhite ? "text-gray-700" : "text-white"}`}
              >
                Kontak
              </button>

              {sessionStatus === "authenticated" && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`text-sm font-medium transition-colors hover:text-red-600 ${isSolidWhite ? "text-gray-700" : "text-white"}`}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <div className="xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isSolidWhite ? "text-gray-700" : "text-white"}`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className={`xl:hidden animate-in slide-in-from-top duration-300 ${
            isSolidWhite
              ? "bg-white shadow-lg"
              : "bg-white/95 backdrop-blur-lg shadow-2xl"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => (
              <React.Fragment key={item.name}>
                <button
                  onClick={() => {
                    handleMainNavClick(item.page);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                >
                  {item.name}
                </button>
                {item.page === "students-life" && bludUrl && (
                  <a
                    href={bludUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Blud
                  </a>
                )}
              </React.Fragment>
            ))}
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-3 py-1">
                About
              </p>
              {dropdownItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onNavigate(item.page);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#0268ab]"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-3 py-1">
                Program Keahlian
              </p>
              {loadingMajors && (
                <p className="px-3 py-2 text-sm text-gray-500">Memuat...</p>
              )}
              {!loadingMajors && majors.length === 0 && (
                <p className="px-3 py-2 text-sm text-gray-500">
                  Belum ada data
                </p>
              )}
              {!loadingMajors &&
                majors.map((major) => {
                  const comps = major.competencies || [];
                  if (comps.length <= 1) {
                    return (
                      <button
                        key={major.id}
                        onClick={() => {
                          scrollToPrograms();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#0268ab]"
                      >
                        {major.name}
                      </button>
                    );
                  }
                  return (
                    <div
                      key={major.id}
                      className="px-1 py-1 border border-gray-100 rounded-lg bg-white shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-800 px-2 py-1">
                        {major.name}
                      </p>
                      <div className="pl-2.5 space-y-0.5">
                        {comps.map((comp) => (
                          <button
                            key={comp.id}
                            onClick={() => {
                              scrollToPrograms();
                              setIsOpen(false);
                            }}
                            className="block w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-[#0268ab] hover:bg-blue-50 rounded-md transition-colors"
                          >
                            {comp.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => {
                onNavigate("contact");
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Kontak
            </button>

            {sessionStatus === "authenticated" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full text-left px-3 py-2 text-red-600 font-semibold hover:bg-gray-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
