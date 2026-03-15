'use client';

import { useEffect, useState } from 'react';
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

const STORAGE_KEY = 'smk_popup_dismissed';

interface AnnouncementPopupProps {
  onNavigate?: (page: PageType) => void;
}

export default function AnnouncementPopup({ onNavigate }: AnnouncementPopupProps) {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika sudah di-dismiss hari ini
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Fetch setting dari API
    fetch('/api/settings')
      .then(r => r.json())
      .then(j => {
        if (!j.success) return;
        const rows: { settingKey: string; settingValue: string | null }[] = j.data ?? [];
        const get = (key: string) => rows.find(r => r.settingKey === key)?.settingValue ?? null;

        const isActive = get('popup_active') === 'true';
        if (!isActive) return;

        const data: PopupData = {
          isActive,
          image: get('popup_image'),
          title: get('popup_title'),
          buttonLabel: get('popup_button_label') ?? 'Cek Selengkapnya',
          buttonUrl: get('popup_button_url'),
          buttonType: (get('popup_button_type') as 'external' | 'internal') ?? 'external',
        };

        setPopup(data);
        // Delay sedikit biar animasi masuk terasa
        setTimeout(() => setVisible(true), 100);
      })
      .catch(() => {/* silent */});
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setPopup(null);
      sessionStorage.setItem(STORAGE_KEY, '1');
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
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Tombol close pojok kanan atas */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" strokeWidth={3} />
        </button>

        {/* Gambar */}
        {popup.image && !imgError ? (
          <div className="relative w-full aspect-4/3 bg-gray-100">
            <Image
              src={popup.image}
              alt={popup.title ?? 'Pengumuman'}
              fill
              unoptimized
              className="object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          /* Fallback jika tidak ada gambar */
          popup.title && (
            <div className="px-8 pt-12 pb-2 text-center">
              <p className="text-xl font-bold text-gray-900 leading-snug">{popup.title}</p>
            </div>
          )
        )}

        {/* Button area */}
        {popup.buttonUrl && (
          <div className="px-6 py-5 flex justify-center">
            <button
              onClick={handleButton}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-sm px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
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
