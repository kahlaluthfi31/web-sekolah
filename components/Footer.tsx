
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Mail, MapPin, Instagram, Facebook, Youtube, Music2, MessageSquare, Linkedin, Twitter, Send, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { PageType } from '../App';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          const map: Record<string, string> = {};
          json.data.forEach((s: { settingKey: string; settingValue: string | null }) => {
            map[s.settingKey] = s.settingValue ?? '';
          });
          setSettings(map);
        }
      })
      .catch(() => undefined);
  }, []);

  const siteName = settings['site_name'] || 'SMK Negeri 1 Ciamis';
  const address = settings['contact_address'] || 'Jl. Jenderal Sudirman No. 269, Ciamis, Jawa Barat, Indonesia';
  const email = settings['contact_email_main'] || 'smkn1ciamis@smkn1ciamis.sch.id';
  const emailAlt = settings['contact_email_alt'] || '';
  const phone = settings['contact_phone_main'] || '(0265) 771204';
  const whatsapp = settings['contact_whatsapp_main'] || '';
  const socialLinks = useMemo(() => {
    const collected = Object.entries(settings)
      .filter(([key, value]) => key.startsWith('social_') && value)
      .map(([key, value]) => {
        const name = key.replace(/^social_/, '') || 'social';
        return { key, name, url: value as string };
      });

    if (collected.length) return collected;

    // Fallback defaults so footer stays filled even sebelum data diisi
    return [
      { key: 'social_instagram', name: 'instagram', url: 'https://www.instagram.com/smkn1ciamis' },
      { key: 'social_youtube', name: 'youtube', url: 'https://www.youtube.com/@MultimediaSMKNegeri1Ciamis' },
    ];
  }, [settings]);

  type LinkItem = { label: string; url: string; type?: 'internal' | 'external'; enabled?: boolean };
  type NavSection = { title: string; links: LinkItem[]; enabled?: boolean };

  const navSections: NavSection[] = useMemo(() => {
    const raw = settings['footer_nav_sections_json'];
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as NavSection[];
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        console.warn('Invalid footer_nav_sections_json', err);
      }
    }
    return [
      {
        title: 'Navigasi Cepat',
        links: [
          { label: 'Beranda', url: 'home', type: 'internal', enabled: true },
          { label: 'Profil Sekolah', url: 'about-us', type: 'internal', enabled: true },
          { label: 'Sarana Prasarana', url: 'campus', type: 'internal', enabled: true },
          { label: 'Berita & Agenda', url: 'events', type: 'internal', enabled: true },
          { label: 'Kehidupan Siswa', url: 'students-life', type: 'internal', enabled: true },
          { label: 'PPDB', url: 'admissions', type: 'internal', enabled: true },
          { label: 'Kontak', url: 'contact', type: 'internal', enabled: true },
        ],
      },
    ];
  }, [settings]);

  const cleanNumber = (value: string) => value.replace(/[^0-9+]/g, '') || value;

  const handleNavigate = (link: LinkItem) => {
    if (link.type === 'external' || (!link.type && !onNavigate)) {
      if (link.url) window.open(link.url, '_blank', 'noopener');
      return;
    }
    // internal
    const page = link.url as PageType;
    onNavigate?.(page);
  };

  const resolveSocialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('instagram') || n === 'ig') return Instagram;
    if (n.includes('facebook') || n === 'fb') return Facebook;
    if (n.includes('youtube') || n.includes('yt')) return Youtube;
    if (n.includes('tiktok') || n.includes('tik-tok')) return Music2;
    if (n.includes('linkedin') || n.includes('linked')) return Linkedin;
    if (n.includes('twitter') || n.includes('x_') || n === 'x') return Twitter;
    if (n.includes('telegram')) return Send;
    if (n.includes('whatsapp') || n.includes('wa')) return MessageCircle;
    return LinkIcon;
  };

  return (
    <footer className="bg-[#0b5f97] text-white border-t border-white/15 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-14">
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="inline-flex items-center gap-3 mb-10 group"
          >
            <Image
              src="/images/web/logo-smkn1-ciamis.png"
              alt="Logo SMK Negeri 1 Ciamis"
              width={44}
              height={44}
              className="w-11 h-11 object-contain"
            />
            <div className="text-left leading-tight">
              <p className="text-xl font-bold text-white group-hover:text-[#82d1ff] transition-colors leading-none">{siteName}</p>
              <p className="text-sm text-white/70 mt-0.5 leading-snug">Sekolah Pusat Keunggulan</p>
            </div>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10 mb-12">
            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <MapPin className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Alamat Sekolah</h4>
              </div>
              <p className="text-sm leading-7 text-white/80">{address}</p>
            </div>

            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <Mail className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Email</h4>
              </div>
              <div className="flex flex-col gap-1.5">
                <a href={`mailto:${email}`} className="text-sm leading-6 text-white/80 hover:text-white transition-colors">
                  <span className="block font-medium text-white">Utama</span>
                  <span className="block">{email}</span>
                </a>
                {emailAlt && (
                  <a href={`mailto:${emailAlt}`} className="text-sm leading-6 text-white/80 hover:text-white transition-colors">
                    <span className="block font-medium text-white">Alternatif</span>
                    <span className="block">{emailAlt}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <MessageSquare className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Kontak</h4>
              </div>
              <div className="flex flex-col gap-1.5 text-sm leading-6 text-white/80">
                <a href={`tel:${cleanNumber(phone)}`} className="hover:text-white transition-colors">
                  <span className="block font-medium text-white">Telepon Utama</span>
                  <span className="block">{phone}</span>
                </a>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${cleanNumber(whatsapp).replace(/^\+/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <span className="block font-medium text-white">WhatsApp Utama</span>
                    <span className="block">{whatsapp}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-1">
              <div className="flex items-center gap-2.5 mb-3 text-white">
                <h4 className="font-semibold">Media Sosial</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = resolveSocialIcon(social.name);
                  const label = social.name.replace(/_/g, ' ');
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 md:pt-10">
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
                {navSections
                  .filter((section) => section.enabled !== false)
                  .map((section, idx) => (
                    <div key={`${section.title}-${idx}`} className="space-y-3">
                      <h4 className="font-semibold text-lg">{section.title}</h4>
                      <div className="flex flex-col gap-2.5">
                        {section.links
                          .filter((l) => l.enabled !== false)
                          .map((link, i) => (
                            <button
                              key={`${section.title}-${i}-${link.label}`}
                              type="button"
                              onClick={() => handleNavigate(link)}
                              className="text-sm text-white/75 hover:text-white transition-colors text-left"
                            >
                              {link.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* <div>
                <h4 className="font-semibold text-lg mb-6">Lokasi Sekolah</h4>
                <div className="rounded-xl overflow-hidden border border-white/15 h-56">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2516889264466!2d108.38642!3d-7.309722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6559a1f1f1f1f1%3A0x1f1f1f1f1f1f1f1f!2sJl.%20Jenderal%20Sudirman%20No.%20269%2C%20Ciamis%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex items-center justify-center text-xs text-white/60">
          <p>© {new Date().getFullYear()} SMK Negeri 1 Ciamis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


