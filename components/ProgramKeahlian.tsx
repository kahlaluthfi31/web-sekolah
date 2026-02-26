
import React from 'react';
import { Building2, DollarSign, ShoppingCart, HandCoins, Monitor, Tv, Sprout, ArrowUpRight } from 'lucide-react';

const ProgramKeahlian: React.FC = () => {
  const programs = [
    {
      icon: Building2,
      title: "Administrasi Perkantoran",
      description: "Kami menyelenggarakan pendidikan profesional di bidang administrasi perkantoran, mulai dari pengelolaan dokumen, pelayanan administratif, hingga praktik perkantoran modern sesuai standar industri.",
    },
    {
      icon: DollarSign,
      title: "Akuntansi",
      description: "Program keahlian akuntansi membekali siswa dengan keterampilan pengelolaan keuangan, pencatatan transaksi, penyusunan laporan keuangan, serta penggunaan aplikasi akuntansi terbaru.",
    },
    {
      icon: ShoppingCart,
      title: "Pemasaran",
      description: "Jurusan pemasaran mengajarkan strategi pemasaran modern, pelayanan pelanggan, perencanaan promosi, hingga praktik kewirausahaan agar siswa siap menghadapi dunia bisnis.",
    },
    {
      icon: HandCoins,
      title: "Usaha Perjalanan Wisata",
      description: "Siswa dilatih dalam pelayanan perjalanan wisata, perencanaan paket wisata, pengetahuan destinasi, hingga praktik layanan tour & travel dengan standar industri pariwisata.",
    },
    {
      icon: Monitor,
      title: "Teknik Komputer dan Jaringan",
      description: "Program ini memberikan keterampilan dalam instalasi, perawatan, dan perbaikan komputer, troubleshooting, serta pengelolaan sistem jaringan berbasis teknologi terbaru.",
    },
    {
      icon: Tv,
      title: "Teknik Audio Video",
      description: "Jurusan teknik audio video fokus pada keahlian berbasis teknologi, perakitan, dan perawatan perangkat elektronik, sistem audio, video, serta teknologi multimedia.",
    },
    {
      icon: Sprout,
      title: "Agrobisnis",
      description: "Bidang agrobisnis membekali siswa dengan keterampilan budidaya tanaman, manajemen usaha pertanian, pengolahan hasil tani, serta penerapan teknologi pertanian modern.",
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kompetensi Keahlian</span>
          <span className="text-xs text-gray-400">02 / 04</span>
        </div>

        {/* Headline + intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 leading-[1.05] tracking-tight">
            Program <em className="not-italic font-bold text-[#0268ab]">Keahlian</em>
          </h2>
          <div className="max-w-xs">
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Kami menawarkan berbagai program keahlian yang dirancang untuk membekali siswa dengan kompetensi profesional dan siap bersaing di dunia industri.
            </p>
            <button className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200">
              <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
                Lihat Semua Program
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {programs.map((program, index) => (
            <div key={index} className="flex gap-4 group">
              {/* Icon Circle */}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <program.icon className="w-7 h-7" strokeWidth={2} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProgramKeahlian;
