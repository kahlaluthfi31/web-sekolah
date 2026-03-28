'use client'

import React, { useEffect, useState } from 'react'
import NewsDetailsPage from '@/app/pages/NewsDetailsPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { PageType } from '@/App'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NewsSlugPage({ params }: PageProps) {
  const { slug } = React.use(params)
  const [loading, setLoading] = useState(true)

  const handleNavigate = (page: PageType) => {
    if (page === 'news') {
      window.location.href = '/berita'
      return
    }

    sessionStorage.setItem('smk_last_page', page)
    window.location.href = '/'
  }

  useEffect(() => {
    let active = true

    const loadNews = async () => {
      try {
  const res = await fetch(`/api/news/slug/${slug}`)
        const json = await res.json()
        if (!active) return
        if (json?.success && json.data) {
          sessionStorage.setItem('selected_news_item', JSON.stringify(json.data))
        } else {
          sessionStorage.removeItem('selected_news_item')
        }
      } catch {
        if (active) sessionStorage.removeItem('selected_news_item')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadNews()
    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigate} currentPage="news" />
        <div className="min-h-[70vh] flex items-center justify-center text-sm text-gray-500">
          Memuat berita...
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage="news" />
      <NewsDetailsPage onBack={() => { window.location.href = '/berita' }} />
      <Footer />
    </div>
  )
}
