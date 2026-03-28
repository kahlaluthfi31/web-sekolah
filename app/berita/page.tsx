'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsPageList from '@/app/pages/NewsPageList'
import type { PageType } from '@/App'

const SESSION_KEY = 'smk_last_page'

export default function BeritaPage() {
  const handleNavigate = (page: PageType) => {
    if (page === 'news') return
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_KEY, page)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage="news" />
      <NewsPageList />
      <Footer />
    </div>
  )
}
