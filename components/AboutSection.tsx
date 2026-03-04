
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Tentang Kami</span>
          <span className="text-xs text-gray-400">01 / 08</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-end">

          {/* Left — Photo column (5/12) */}
          <div className="lg:col-span-5 relative">

            <div className="relative overflow-hidden rounded-2xl aspect-[3/4]" style={{ zIndex: 1 }}>
              <img
                src="/images/web/foto-kepala.png"
                alt="Kepala Sekolah"
                className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              {/* Name tag inside photo */}
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs tracking-[0.2em] uppercase font-medium opacity-80 mb-1">Kepala Sekolah</p>
                <p className="text-lg font-semibold">SMKN 1 Ciamis</p>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Right — Content column (6/12) */}
          <div className="lg:col-span-6 lg:pb-4">

            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl font-light text-gray-900 leading-[1.1] mb-10 tracking-tight">
              Sambutan <em className="not-italic font-bold text-[#0268ab]">Kepala Sekolah</em>
            </h2>

            {/* Divider line */}
            <div className="w-8 h-px bg-gray-900 mb-10"></div>

            {/* Quote */}
            <p className="text-gray-500 text-lg leading-relaxed mb-12 font-light">
              "Selama lebih dari tiga dekade, kami berkomitmen membentuk generasi unggul yang siap menghadapi tantangan global — dengan karakter kuat, keahlian nyata, dan semangat belajar tanpa batas."
            </p>

            {/* Stats — horizontal minimal */}
            <div className="grid grid-cols-3 divide-x divide-gray-200 mb-12">
              {[
                { value: '1.200+', label: 'Siswa Aktif' },
                { value: '12', label: 'Program Keahlian' },
                { value: '32+', label: 'Tahun Berdiri' },
              ].map((s, i) => (
                <div key={i} className={`${i === 0 ? 'pr-6' : 'px-6'}`}>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="group inline-flex items-center gap-3 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200">
              <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
                Baca Selengkapnya
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;


