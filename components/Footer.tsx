
import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Music2, MessageSquare } from 'lucide-react';
import { PageType } from '../App';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerLinks: Array<{ label: string; page: PageType }> = [
    { label: 'Beranda', page: 'home' },
    { label: 'Profil Sekolah', page: 'about-us' },
    { label: 'Sarana Prasarana', page: 'campus' },
    { label: 'Berita & Agenda', page: 'events' },
    { label: 'Kehidupan Siswa', page: 'students-life' },
    { label: 'PPDB', page: 'admissions' },
    { label: 'Kontak', page: 'contact' },
  ];

  return (
    <footer className="bg-[#0b5f97] text-white border-t border-white/15 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-14">
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="inline-flex items-center gap-3 mb-10 group"
          >
            <img
              src="/images/web/logo-smkn1-ciamis.png"
              alt="Logo SMK Negeri 1 Ciamis"
              className="w-11 h-11 object-contain"
            />
            <div className="text-left leading-tight">
              <p className="text-xl font-bold text-white group-hover:text-[#82d1ff] transition-colors leading-none">SMK Negeri 1 Ciamis</p>
              <p className="text-sm text-white/70 mt-0.5 leading-snug">Sekolah Pusat Keunggulan</p>
            </div>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10 mb-12">
            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <MapPin className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Alamat Sekolah</h4>
              </div>
              <p className="text-sm leading-7 text-white/80">Jl. Jenderal Sudirman No. 269, Ciamis, Jawa Barat, Indonesia</p>
            </div>

            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <Mail className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Surel</h4>
              </div>
              <a href="mailto:smkn1ciamis@smkn1ciamis.sch.id" className="text-sm leading-7 text-white/80 hover:text-white transition-colors">
                smkn1ciamis@smkn1ciamis.sch.id
              </a>
            </div>

            <div className="p-1 xl:pr-6 xl:border-r xl:border-white/20">
              <div className="flex items-center gap-2.5 mb-2 text-white">
                <MessageSquare className="w-4 h-4 text-[#63c5ff]" />
                <h4 className="font-semibold">Kontak</h4>
              </div>
              <a href="tel:+62265771204" className="block text-sm leading-7 text-white/80 hover:text-white transition-colors">
                (0265) 771204
              </a>
            </div>

            <div className="p-1">
              <div className="flex items-center gap-2.5 mb-3 text-white">
                <h4 className="font-semibold">Media Sosial</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://www.instagram.com/smkn1ciamis"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <span className="text-white/80" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </span>
                <a
                  href="https://www.youtube.com/@MultimediaSMKNegeri1Ciamis"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <span className="text-white/80" aria-label="TikTok">
                  <Music2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 md:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-6">Navigasi Cepat</h4>
                <div className="flex flex-col gap-3">
                  {footerLinks.map((link) => (
                    <button
                      key={link.page}
                      type="button"
                      onClick={() => onNavigate?.(link.page)}
                      className="text-sm text-white/75 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-6">Lokasi Sekolah</h4>
                <div className="rounded-xl overflow-hidden border border-white/15 h-56">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2516889264466!2d108.38642!3d-7.309722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6559a1f1f1f1f1%3A0x1f1f1f1f1f1f1f1f!2sJl.%20Jenderal%20Sudirman%20No.%20269%2C%20Ciamis%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
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


