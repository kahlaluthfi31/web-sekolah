
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StudentLife: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kehidupan Siswa</span>
          <span className="text-xs text-gray-400">03 / 05</span>
        </div>

        {/* Headline + intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 leading-[1.05] tracking-tight">
            Kehidupan di <em className="not-italic font-bold text-[#0268ab]">Sekolah</em>
          </h2>
          <div className="max-w-xs">
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Kami percaya pendidikan terbaik terjadi di dalam dan di luar kelas. Setiap siswa didorong untuk aktif, berkreasi, dan tumbuh bersama.
            </p>
            <button className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200">
              <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
                Jelajahi Lebih Lanjut
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4" style={{ gridTemplateRows: '260px 220px' }}>

          {/* Large card — col 1-2, row 1-2 */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
            <img
              src="https://media.istockphoto.com/id/2122148349/id/foto/menulis-ujian-di-universitas.jpg?s=1024x1024&w=is&k=20&c=T5Ap_guLIFlQjBcH7gR_RhAD9dZVNZ817ksM7Q-1h70="
              alt="Lingkungan Belajar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block bg-[#0268ab] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                Akademik
              </span>
              <h3 className="text-white text-xl font-bold leading-tight">
                Lingkungan Belajar<br />yang Kondusif
              </h3>
            </div>
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white/70 text-[11px] font-semibold px-3 py-1.5 rounded-full">
              01
            </div>
          </div>

          {/* Card — col 3, row 1 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500"
              alt="Organisasi Siswa"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white text-xs font-semibold">Organisasi Siswa</p>
            </div>
            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              02
            </div>
          </div>

          {/* Stat card blue — col 4, row 1 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden bg-[#0268ab] flex flex-col items-center justify-center p-5 text-center">
            <p className="text-5xl font-black text-white leading-none mb-2">20+</p>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest leading-tight">
              Organisasi<br />Aktif
            </p>
          </div>

          {/* Stat card dark — col 3, row 2 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-5 text-center">
            <p className="text-5xl font-black text-gray-900 leading-none mb-2">40+</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-tight">
              Event<br />per Tahun
            </p>
          </div>

          {/* Card — col 4, row 2 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=500"
              alt="Fasilitas Modern"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white text-xs font-semibold">Fasilitas Modern</p>
            </div>
            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              03
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StudentLife;


