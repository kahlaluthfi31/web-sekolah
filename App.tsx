'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProgramKeahlian from '@/components/ProgramKeahlian';
import StudentLife from '@/components/StudentLife';
import Testimonials from '@/components/Testimonials';
import RecentNews from '@/components/RecentNews';
import UpcomingEvents from '@/components/UpcomingEvents';
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
import AnnouncementPopup from '@/components/AnnouncementPopup';

export type PageType = 'home' | 'about-us' | 'admissions' | 'faculty' | 'campus' | 'students-life' | 'news' | 'alumni' | 'news-details' | 'contact' | 'events';

const SESSION_KEY = 'smk_last_page';

// Safe sessionStorage read — returns 'home' during SSR
function getInitialPage(): PageType {
  if (typeof window === 'undefined') return 'home';
  return (sessionStorage.getItem(SESSION_KEY) as PageType | null) ?? 'home';
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage);

  const navigateTo = (page: PageType) => {
    sessionStorage.setItem(SESSION_KEY, page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
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
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <AnnouncementPopup onNavigate={navigateTo} />
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      <main className="grow overflow-x-hidden">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
