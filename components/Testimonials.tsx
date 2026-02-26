
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const allTestimonials = [
    {
      name: "Andi Firmansyah",
      position: "Network Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      text: "Ilmu yang saya dapat di SMKN 1 Ciamis benar-benar membuka jalan karier saya. Sekarang saya bekerja sebagai network engineer di perusahaan multinasional.",
    },
    {
      name: "Siti Nurhaliza",
      position: "Accountant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      text: "Guru-guru di sini sangat berdedikasi. Mereka tidak hanya mengajar teori, tapi juga membekali kami dengan pengalaman praktik yang langsung bisa diterapkan.",
    },
    {
      name: "Rizky Maulana",
      position: "Software Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      text: "Fasilitas laboratorium yang lengkap sangat membantu proses belajar saya. Saya bangga pernah menjadi bagian dari keluarga besar SMKN 1 Ciamis.",
    },
    {
      name: "Dewi Kartika",
      position: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      text: "Pengalaman magang industri yang difasilitasi sekolah membuat saya siap menghadapi dunia kerja. Terima kasih SMKN 1 Ciamis!",
    },
    {
      name: "Budi Santoso",
      position: "Data Analyst",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      text: "Kurikulum yang mengikuti perkembangan industri membuat saya tidak kesulitan beradaptasi di dunia kerja. Sangat direkomendasikan!",
    },
    {
      name: "Maya Anggraini",
      position: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      text: "Selain skill teknis, soft skill yang diajarkan juga sangat membantu karier saya. SMKN 1 Ciamis adalah tempat terbaik untuk mempersiapkan masa depan.",
    },
    {
      name: "Faisal Rahman",
      position: "System Administrator",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
      text: "Pengalaman belajar di SMKN 1 Ciamis sangat berkesan. Guru-guru profesional dan lingkungan belajar yang kondusif membentuk karakter saya.",
    },
    {
      name: "Linda Wijaya",
      position: "Content Creator",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      text: "Kegiatan ekstrakurikuler yang beragam membuat saya bisa mengembangkan bakat dan minat. Alumni SMKN 1 Ciamis selalu kompak dan saling mendukung.",
    },
    {
      name: "Ahmad Hidayat",
      position: "Web Developer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
      text: "Project-based learning yang diterapkan membuat saya terbiasa menghadapi masalah real-world. Saya merekomendasikan SMKN 1 Ciamis untuk semua calon siswa.",
    },
  ];

  const totalPages = Math.ceil(allTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestimonials = allTestimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Testimoni Alumni</span>
          <span className="text-xs text-gray-400">03 / 04</span>
        </div>

        {/* Main layout: left headline + right cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Headline + Pagination */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-5xl sm:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight mb-auto">
              Alumni<br />
              <em className="not-italic font-bold text-[#0268ab]">SMKN 1 CIAMIS</em>
            </h2>

            {/* Pagination */}
            <div className="flex items-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#0268ab] hover:text-[#0268ab] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{currentPage.toString().padStart(2, '0')}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-400">{totalPages.toString().padStart(2, '0')}</span>
              </div>

              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#0268ab] hover:text-[#0268ab] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Cards grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentTestimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Avatar */}
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.position}</p>
                  </div>
                </div>

                {/* Text */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t.text}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;



