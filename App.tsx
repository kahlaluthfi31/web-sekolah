'use client';



import React, { useState, useEffect, useRef, useCallback } from 'react';

import Navbar from '@/components/Navbar';

import Hero from '@/components/Hero';

import ProgramKeahlian from '@/components/ProgramKeahlian';

import StudentLife from '@/components/StudentLife';

import Testimonials from '@/components/Testimonials';

import RecentNews from '@/components/RecentNews';

import UpcomingEvents from '@/components/UpcomingEvents';

import SocialFeedsVertikal from '@/components/SocialFeeds';

import Partners from '@/components/Partners';

import Footer from '@/components/Footer';

import AboutPage from '@/app/pages/AboutPage';

import AdmissionsPage from '@/app/pages/AdmissionsPage';

import FacultyPage from '@/app/pages/FacultyPage';

import CampusPage from '@/app/pages/CampusPage';

import StudentLifePage from '@/app/pages/StudentLifePage';

import NewsPageList from '@/app/pages/NewsPageList';

import AlumniPage from '@/app/pages/AlumniPage';

import NewsDetailsPage from '@/app/pages/NewsDetailsPage';

import ContactPage from '@/app/pages/ContactPage';

import EventsPage from '@/app/pages/EventsPage';

import AnnouncementPopup from '@/components/AnnouncementPopup';

import { useSession } from 'next-auth/react';



export type PageType = 'home' | 'about-us' | 'admissions' | 'faculty' | 'campus' | 'students-life' | 'news' | 'alumni' | 'news-details' | 'contact' | 'events';



const SESSION_KEY = 'smk_last_page';



// Safe sessionStorage read — returns 'home' during SSR

function getInitialPage(): PageType {

  if (typeof window === 'undefined') return 'home';

  return (sessionStorage.getItem(SESSION_KEY) as PageType | null) ?? 'home';

}



const App: React.FC = () => {

  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage);

  const [hostName, setHostName] = useState('localhost:3000');

  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioConsent, setAudioConsent] = useState<'allow' | 'deny' | null>(null);

  const [showAudioPrompt, setShowAudioPrompt] = useState(false);

  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const { data: session } = useSession();



  useEffect(() => {

    // Preload hero video for instant playback

    const preloadVideo = () => {

      const video = document.createElement('video');

      video.preload = 'auto';

      video.muted = true;

      video.src = '/videos/hero-bg.mp4';

      video.load();

    };



    // Preload video immediately

    preloadVideo();

  }, []);



  useEffect(() => {

    if (typeof window === 'undefined') return;

    setHostName(window.location.host || 'localhost:3000');

  }, []);



  useEffect(() => {

    if (typeof window === 'undefined') return;



    const params = new URLSearchParams(window.location.search);

    const welcome = params.get('welcome');

    if (welcome) {

      const displayName = session?.user?.name?.split(' ')[0] || session?.user?.name || 'Pengguna';

      const msg = welcome === 'new' ? `Selamat Datang ${displayName}` : `Selamat Datang kembali ${displayName}`;

      setWelcomeMessage(msg);

      setTimeout(() => setWelcomeMessage(null), 4000);



      // Bersihkan query agar tidak muncul lagi saat navigate berikutnya

      params.delete('welcome');

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;

      window.history.replaceState({}, '', newUrl);

    }

  }, [session?.user?.name]);



  useEffect(() => {

    if (typeof window === 'undefined') return;



    if (!audioConsent && currentPage === 'home') {

      setShowAudioPrompt(true);

    } else {

      setShowAudioPrompt(false);

    }

  }, [audioConsent, currentPage]);



  const navigateTo = (page: PageType) => {

    sessionStorage.setItem(SESSION_KEY, page);

    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });

  };



  const playAudio = useCallback(async () => {

    if (!audioRef.current) return;

    try {

      audioRef.current.volume = 0.4;

      await audioRef.current.play();

    } catch (error) {

      console.log('⚠️ Audio playback blocked or failed:', error);

    }

  }, []);



  useEffect(() => {

    if (currentPage !== 'home') {

      audioRef.current?.pause();

      return;

    }



    if (audioConsent === 'allow') {

      playAudio();

    }

  }, [currentPage, audioConsent, playAudio]);



  const handleAllowAudio = async () => {

    setAudioConsent('allow');

    setShowAudioPrompt(false);

    await playAudio();

  };



  const handleDenyAudio = () => {

    setAudioConsent('deny');

    setShowAudioPrompt(false);

    audioRef.current?.pause();

  };



  const renderPage = () => {

    switch (currentPage) {

      case 'home':

        return (

          <>

            <Hero onNavigate={navigateTo} />

            {/* <QuickStats /> */}

            {/* <div id="about"><AboutSection /></div> */}

            <ProgramKeahlian />

            <div id="events"><UpcomingEvents /></div>

            <SocialFeedsVertikal />

            <div id="news"><RecentNews /></div>

            <div id="students"><StudentLife /></div>

            <Testimonials />

            <Partners />

            {/* <div id="programs"><FeaturedPrograms /></div> */}

          </>

        );

      case 'about-us':

        return <AboutPage />;

      case 'admissions':

        return <AdmissionsPage />;

      case 'faculty':

        return <FacultyPage />;

      case 'campus':

        return <CampusPage />;

      case 'students-life':

        return <StudentLifePage />;

      case 'events':

        return <EventsPage />;

      case 'news':

        return <NewsPageList onNavigate={navigateTo} />;

      case 'alumni':

        return <AlumniPage />;

      case 'news-details':

        return <NewsDetailsPage onBack={() => navigateTo('news')} />;

      case 'contact':

        return <ContactPage />;

      default:

        return <Hero onNavigate={navigateTo} />;

    }

  };



  return (

    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* Background Audio - Play once on first visit */}

      <audio ref={audioRef} preload="auto">

        <source src="/audio/welcome.aac" type="audio/aac" />

        <source src="/audio/welcome.mp3" type="audio/mpeg" />

        Your browser does not support the audio element.

      </audio>



      {welcomeMessage && (

        <div className="fixed top-4 right-4 z-120">

          <div className="flex items-center gap-3 bg-white text-gray-800 shadow-xl rounded-xl px-4 py-3 text-sm border border-gray-200 min-w-64 max-w-sm">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">

                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-6.5 6.5a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 5.793-5.793a1 1 0 0 1 1.408 0Z" clipRule="evenodd" />

              </svg>

            </div>

            <div className="flex-1 font-semibold leading-snug">{welcomeMessage}</div>

            <button

              type="button"

              onClick={() => setWelcomeMessage(null)}

              className="text-gray-500 hover:text-gray-700 transition"

              aria-label="Tutup"

            >

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">

                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />

              </svg>

            </button>

          </div>

        </div>

      )}



      {showAudioPrompt && currentPage === 'home' && (

  <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-110 w-[86%] max-w-sm rounded-md border border-gray-200 bg-white shadow-xl px-3 py-2">

          <p className="text-xs text-center text-gray-800 font-semibold mb-1.5">{hostName} akan memutar audio</p>

          <div className="flex items-center justify-center gap-2">

            <button

              type="button"

              onClick={handleDenyAudio}

              className="px-3 py-1.5 rounded-sm border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-100 transition"

            >

              Deny

            </button>

            <button

              type="button"

              onClick={handleAllowAudio}

              className="px-3 py-1.5 rounded-sm bg-blue-600 text-xs text-white hover:bg-blue-700 transition shadow-sm"

            >

              Allow

            </button>

          </div>

        </div>

      )}



      <AnnouncementPopup onNavigate={navigateTo} currentPage={currentPage} />

      <Navbar onNavigate={navigateTo} currentPage={currentPage} />

      <main className="grow overflow-x-hidden">

        {renderPage()}

      </main>

      <Footer onNavigate={navigateTo} />

    </div>

  );

};



export default App;

