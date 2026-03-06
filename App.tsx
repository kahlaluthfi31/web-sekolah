'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuickStats from '@/components/QuickStats';
import AboutSection from '@/components/AboutSection';
import ProgramKeahlian from '@/components/ProgramKeahlian';
import FeaturedPrograms from '@/components/FeaturedPrograms';
import StudentLife from '@/components/StudentLife';
import Testimonials from '@/components/Testimonials';
import RecentNews from '@/components/RecentNews';
import UpcomingEvents from '@/components/UpcomingEvents';
import SocialFeeds from '@/components/SocialFeeds';
import SocialFeedsVertikal from '@/components/SocialFeeds(vertikal)';
import Partners from '@/components/Partners';
import Footer from '@/components/Footer';
import AboutPage from '@/app/pages/AboutPage';
import AdmissionsPage from '@/app/pages/AdmissionsPage';
import FacultyPage from '@/app/pages/FacultyPage';
import CampusPage from '@/app/pages/CampusPage';
import StudentLifePage from '@/app/pages/StudentLifePage';
import NewsPage from '@/app/pages/NewsPage';
import AlumniPage from '@/app/pages/AlumniPage';
import NewsDetailsPage from '@/app/pages/NewsDetailsPage';
import ContactPage from '@/app/pages/ContactPage';
import EventsPage from '@/app/pages/EventsPage';

export type PageType = 'home' | 'about-us' | 'admissions' | 'faculty' | 'campus' | 'students-life' | 'news' | 'alumni' | 'news-details' | 'contact' | 'events';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const playAudioWithFallback = async () => {
      if (!audioRef.current || hasTriggeredRef.current) return;
      
      try {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
        hasTriggeredRef.current = true;
        setAudioPlayed(true);
        console.log('✓ Audio autoplay successful');
      } catch (error) {
        console.log('⚠ Autoplay blocked, waiting for valid interaction (click, wheel, or key press)...');
        
        // Handler for meaningful user interactions only
        const playOnInteraction = async (event: Event) => {
          console.log('🎯 Interaction detected:', event.type);
          
          if (!audioRef.current || hasTriggeredRef.current) return;
          
          try {
            audioRef.current.volume = 0.4;
            await audioRef.current.play();
            hasTriggeredRef.current = true;
            setAudioPlayed(true);
            console.log('✅ Audio playing!');
            
            // Clean up all listeners
            removeAllListeners();
          } catch (err) {
            console.log('❌ Still blocked:', err);
          }
        };
        
        const removeAllListeners = () => {
          document.removeEventListener('click', playOnInteraction as EventListener);
          document.removeEventListener('wheel', playOnInteraction as EventListener);
          document.removeEventListener('touchstart', playOnInteraction as EventListener);
          document.removeEventListener('keydown', playOnInteraction as EventListener);
          document.removeEventListener('mousedown', playOnInteraction as EventListener);
          console.log('🧹 Event listeners removed');
        };
        
        // Only use meaningful interaction events (NOT passive)
        document.addEventListener('click', playOnInteraction as EventListener);
        document.addEventListener('wheel', playOnInteraction as EventListener);
        document.addEventListener('touchstart', playOnInteraction as EventListener);
        document.addEventListener('keydown', playOnInteraction as EventListener);
        document.addEventListener('mousedown', playOnInteraction as EventListener);
        
        console.log('👂 Waiting for: click, wheel, touch, or keypress');
      }
    };
    
    // Ensure audio is loaded
    if (audioRef.current) {
      audioRef.current.load();
    }
    
    // Try autoplay
    setTimeout(playAudioWithFallback, 300);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        return <NewsPage />;
      case 'alumni':
        return <AlumniPage />;
      case 'news-details':
        return <NewsDetailsPage />;
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
      
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      <main className="grow overflow-x-hidden">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
