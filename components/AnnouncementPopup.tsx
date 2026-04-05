'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import type { PageType } from '@/App';

interface PopupData {
  isActive: boolean;
  image: string | null;
  title: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  buttonType: 'external' | 'internal';
}

type PopupItem = Omit<PopupData, 'isActive'>;

interface AnnouncementPopupProps {
  onNavigate?: (page: PageType) => void;
  currentPage?: PageType;
}

export default function AnnouncementPopup({ onNavigate, currentPage }: AnnouncementPopupProps) {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [closing, setClosing] = useState(false);
  const initOnce = useRef(false);

  useEffect(() => {
    if (!visible || !popup) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
    };
  }, [visible, popup]);

  useEffect(() => {
    // Tampilkan hanya di landing page / beranda
    if (currentPage && currentPage !== 'home') return;

    // Hindari double-run (mis. React Strict Mode dev) agar 1 popup per refresh
    if (initOnce.current) return;
    initOnce.current = true;

    // Fetch setting dari API
    fetch('/api/settings')
      .then(r => r.json())
      .then(j => {
        if (!j.success) return;
        const rows: { settingKey: string; settingValue: string | null }[] = j.data ?? [];
        const get = (key: string) => rows.find(r => r.settingKey === key)?.settingValue ?? null;

        const isActive = get('popup_active') === 'true';
        if (!isActive) return;

        let items: PopupItem[] = [];
        try {
          const parsed = JSON.parse(get('popup_items_json') ?? '[]');
          if (Array.isArray(parsed)) {
            items = parsed
              .map((it) => ({
                image: it.image ?? null,
                title: it.title ?? null,
                buttonLabel: it.buttonLabel ?? 'Cek Selengkapnya',
                buttonUrl: it.buttonUrl ?? null,
                buttonType: (it.buttonType as 'external' | 'internal') ?? 'external',
              }))
              .filter((it) => it.buttonUrl || it.title || it.image);
          }
        } catch (err) {
          console.warn('Failed to parse popup items', err);
        }

        // fallback ke skema lama (single)
        if (items.length === 0) {
          items = [
            {
              image: get('popup_image'),
              title: get('popup_title'),
              buttonLabel: get('popup_button_label') ?? 'Cek Selengkapnya',
              buttonUrl: get('popup_button_url'),
              buttonType: (get('popup_button_type') as 'external' | 'internal') ?? 'external',
            },
          ];
        }

        if (items.length === 0) return;

        const randomItem = items[Math.floor(Math.random() * items.length)];
        setPopup({ isActive, ...randomItem });
        // Delay sedikit biar animasi masuk terasa
        setTimeout(() => setVisible(true), 100);
      })
      .catch(() => {/* silent */});
  }, [currentPage]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setPopup(null);
    }, 250);
  };

  const handleButton = () => {
    if (!popup?.buttonUrl) return;
    if (popup.buttonType === 'external') {
      window.open(popup.buttonUrl, '_blank', 'noopener,noreferrer');
    } else {
      // internal: navigasi dalam app
      onNavigate?.(popup.buttonUrl as PageType);
      handleClose();
    }
  };

  if (!popup || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 transition-all duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Area klik luar tanpa overlay gelap */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
      />

      {/* Kontainer tanpa card agar gambar tampil penuh (ukuran 640x480px, rasio 4:3) */}
      <div
        className={`relative w-full transition-all duration-300 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        style={{ width: '640px', maxWidth: '85vw', aspectRatio: '4 / 3' }}
      >
        {/* Tombol close pojok kanan atas */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#0092DD] hover:bg-[#0077BB] text-white shadow-lg transition-all hover:scale-110 active:scale-95"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" strokeWidth={3} />
        </button>

        {/* Gambar tidak terpotong (object-contain) dengan ukuran seragam */}
        {popup.image && !imgError ? (
          <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
            <Image
              src={popup.image}
              alt={popup.title ?? 'Pengumuman'}
              fill
              unoptimized
              className="object-contain"
              onError={() => setImgError(true)}
            />

            {popup.buttonUrl && (
              <div className="absolute inset-x-0 bottom-0 pb-4 pt-8 bg-linear-to-t from-black/50 via-black/20 to-transparent flex justify-center">
                <button
                  onClick={handleButton}
                  className="inline-flex items-center gap-2 bg-[#0092DD] hover:bg-[#0077BB] active:bg-[#0066A8] text-white font-semibold text-sm px-6 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {popup.buttonLabel ?? 'Cek Selengkapnya'}
                  {popup.buttonType === 'external'
                    ? <ExternalLink className="w-4 h-4" />
                    : <ArrowRight className="w-4 h-4" />
                  }
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Fallback jika tidak ada gambar */
          popup.title && (
            <div className="px-8 pt-12 pb-2 text-center">
              <p className="text-xl font-bold text-gray-900 leading-snug">{popup.title}</p>
            </div>
          )
        )}
        {/* Button fallback jika tidak ada gambar */}
        {!popup.image && popup.buttonUrl && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleButton}
              className="inline-flex items-center gap-2 bg-[#0092DD] hover:bg-[#0077BB] active:bg-[#0066A8] text-white font-semibold text-sm px-6 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {popup.buttonLabel ?? 'Cek Selengkapnya'}
              {popup.buttonType === 'external'
                ? <ExternalLink className="w-4 h-4" />
                : <ArrowRight className="w-4 h-4" />
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
