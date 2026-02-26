
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const RecentNews: React.FC = () => {
  const news = [
    {
      date: "12 Des 2025",
      category: "Akademik",
      title: "SMKN 1 Ciamis Raih Penghargaan Sekolah Terbaik Tingkat Provinsi",
      image: "https://media.istockphoto.com/id/2155834419/id/foto/mahasiswa-belajar-selama-kelas-di-ruang-kuliah.jpg?s=1024x1024&w=is&k=20&c=MWxKI8l7ZvzbNImEn5uorZ7aRwkRryQ2N4ie-RC0iQU=",
      desc: "Penghargaan bergengsi ini diraih atas dedikasi seluruh warga sekolah dalam meningkatkan mutu pendidikan di Jawa Barat.",
    },
    {
      date: "05 Nov 2025",
      category: "Kegiatan",
      title: "Lomba Kompetensi Siswa Tingkat Kabupaten Berhasil Diraih",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500",
      desc: "Tim siswa jurusan TKJ berhasil membawa pulang medali emas pada ajang LKS tahun ini.",
    },
    {
      date: "27 Okt 2025",
      category: "Alumni",
      title: "Reuni Akbar Alumni SMKN 1 Ciamis Digelar Meriah",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=500",
      desc: "Ribuan alumni dari berbagai angkatan hadir merayakan kebersamaan dan berkontribusi untuk almamater.",
    },
    {
      date: "14 Okt 2025",
      category: "Fasilitas",
      title: "Laboratorium Komputer Baru Resmi Dibuka untuk Siswa",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500",
      desc: "Laboratorium berkapasitas 40 unit komputer terbaru kini siap mendukung kegiatan belajar mengajar.",
    },
    {
      date: "02 Sep 2025",
      category: "Prestasi",
      title: "Siswa SMKN 1 Ciamis Juara Olimpiade Sains Nasional",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
      desc: "Dua siswa dari jurusan Rekayasa Perangkat Lunak berhasil meraih juara pertama OSN tingkat nasional.",
    },
    {
      date: "18 Agu 2025",
      category: "Kegiatan",
      title: "Masa Orientasi Siswa Baru Tahun Ajaran 2025/2026",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=500",
      desc: "Sebanyak 480 siswa baru mengikuti kegiatan MPLS yang diisi dengan pengenalan lingkungan dan budaya sekolah.",
    },
  ];

  // Duplicate for seamless infinite loop
  const loop = [...news, ...news];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideNews {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .news-slider {
          animation: slideNews 40s linear infinite;
        }
        .news-slider:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Berita Terbaru</span>
          <span className="text-xs text-gray-400">04 / 04</span>
        </div>

        {/* Headline + CTA row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <h2 className="text-5xl sm:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight">
            Berita <em className="not-italic font-bold text-[#0268ab]">Terbaru</em>
          </h2>
          <button className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200 self-start sm:self-auto pb-1">
            <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
              Semua Berita
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>

      </div>

      {/* Bounded marquee slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          <div 
            className="news-slider flex gap-5 py-2" 
            style={{ width: 'max-content' }}
          >
            {loop.map((item, i) => (
            <div
              key={i}
              className="w-72 shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="aspect-16/10 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0268ab]">{item.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#0268ab] transition-colors duration-200 line-clamp-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

    </section>
    </>
  );
};

export default RecentNews;



