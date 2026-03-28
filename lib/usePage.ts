import React, { createContext, useContext, useState } from 'react';

export type PageType = 'home' | 'about-us' | 'admissions' | 'faculty' | 'campus' | 'students-life' | 'news' | 'alumni' | 'news-details' | 'contact' | 'events' | 'program-keahlian';

interface PageContextType {
  currentPage: PageType;
  setPage: (page: PageType) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);


export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const setPage = (page: PageType) => {
    setCurrentPage(page);
  };

  return React.createElement(
    PageContext.Provider,
    { value: { currentPage, setPage } },
    children
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};
