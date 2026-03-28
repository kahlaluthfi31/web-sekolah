'use client'

import React, { useEffect, useState } from 'react'
import NewsDetailsPage from '@/app/pages/NewsDetailsPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NewsSlugPage({ params }: PageProps) {
  const { slug } = React.use(params)
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Memuat berita...
      </div>
    )
  }

  return <NewsDetailsPage onBack={() => { window.location.href = '/berita' }} />
}
