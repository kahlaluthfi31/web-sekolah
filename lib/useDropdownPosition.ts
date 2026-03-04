'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface DropdownPos {
  top: number
  right: number
}

export function useDropdownPosition(threshold = 150) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [pos, setPos] = useState<DropdownPos>({ top: 0, right: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const calcPos = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const up = window.innerHeight - rect.bottom < threshold
    setDropUp(up)
    setPos({
      top: up ? rect.top : rect.bottom + 4,
      right: window.innerWidth - rect.right,
    })
  }, [threshold])

  // Close on outside click
  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Update position on scroll/resize while open
  useEffect(() => {
    if (!open) return
    function update() { calcPos() }
    window.addEventListener('scroll', update, true) // capture=true catches all scroll events
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, calcPos])

  const toggle = useCallback(() => {
    if (!open) calcPos()
    setOpen(o => !o)
  }, [open, calcPos])

  const close = useCallback(() => setOpen(false), [])

  return { open, dropUp, pos, ref, btnRef, toggle, close }
}
