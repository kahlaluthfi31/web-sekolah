'use client'

import { useEffect, useRef, useState } from 'react'

export interface PageHeaderData {
  title: string
  subtitle?: string | null
  displayTitle?: string
  loading?: boolean
}

function injectLineBreak(raw: string): string {
  if (!raw) return ''
  if (raw.length <= 20) return raw
  // Find nearest space after 20 chars, otherwise fallback at 20
  const breakpoint = raw.indexOf(' ', 20)
  if (breakpoint === -1) return raw
  return `${raw.slice(0, breakpoint)}\n${raw.slice(breakpoint + 1)}`
}

export function usePageHeader(pageKey: string, fallback?: PageHeaderData) {
  const fallbackRef = useRef<PageHeaderData | undefined>(fallback)
  const [header, setHeader] = useState<PageHeaderData | null>(fallback ?? null)
  const [loading, setLoading] = useState(true)

  // Keep fallback stable without retriggering fetch loop when callers pass new object each render
  useEffect(() => {
    fallbackRef.current = fallback
    if (fallback) {
      setHeader({
        ...fallback,
        displayTitle: injectLineBreak(fallback.title),
        loading: false,
      })
      setLoading(false)
    }
  }, [fallback?.title, fallback?.subtitle])

  useEffect(() => {
    let isMounted = true

    const fetchHeader = async () => {
      try {
        const res = await fetch(`/api/page-headers?key=${encodeURIComponent(pageKey)}`)
        if (!res.ok) throw new Error('Failed to fetch page header')
        const json = await res.json()

        if (!isMounted || !json?.success || !json?.data) return

        const { title, subtitle, isActive } = json.data as {
          title?: string
          subtitle?: string | null
          isActive?: boolean
        }

        if (isActive === false) return

  const effectiveTitle = title || fallbackRef.current?.title || ''
  const effectiveSubtitle = subtitle ?? fallbackRef.current?.subtitle ?? ''

        setHeader({
          title: effectiveTitle,
          subtitle: effectiveSubtitle,
          displayTitle: injectLineBreak(effectiveTitle),
          loading: false,
        })
      } catch (error) {
        console.error('Page header fetch failed', error)
        if (fallbackRef.current) {
          setHeader({
            ...fallbackRef.current,
            displayTitle: injectLineBreak(fallbackRef.current.title),
            loading: false,
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchHeader()
    return () => {
      isMounted = false
    }
  }, [pageKey])

  if (!header) {
    return { title: '', subtitle: '', displayTitle: '', loading }
  }

  return { ...header, displayTitle: header.displayTitle ?? injectLineBreak(header.title), loading }
}
