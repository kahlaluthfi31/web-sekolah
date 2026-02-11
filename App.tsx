'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuickStats from '@/components/QuickStats';
import AboutSection from '@/components/AboutSection';
import FeaturedPrograms from '@/components/FeaturedPrograms';
import StudentLife from '@/components/StudentLife';
import Testimonials from '@/components/Testimonials';
import RecentNews from '@/components/RecentNews';
import UpcomingEvents from '@/components/UpcomingEvents';
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

  const navigateTo = (page: PageType) => {
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
            <div id="about"><AboutSection /></div>
            <div id="events"><UpcomingEvents /></div>
            <div id="news"><RecentNews /></div>
            <div id="students"><StudentLife /></div>
            <Testimonials />
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
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
