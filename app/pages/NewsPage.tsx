import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, User, TrendingUp, Newspaper, FileText } from 'lucide-react';
import { usePageHeader } from '@/lib/usePageHeader';

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Top stories');
  const header = usePageHeader('news');

  const newsCategories = ['Top stories', 'Trending News', 'Latest News'];

  const featuredNews = {
    title: "SMKN 1 Ciamis Raih Juara 1 LKS Tingkat Provinsi Jawa Barat",
    category: "Prestasi",
    date: "15 Februari 2024",
    author: "Tim Humas SMKN 1 Ciamis",
    description: "Tim Teknik Komputer dan Jaringan SMKN 1 Ciamis berhasil meraih juara 1 dalam Lomba Kompetensi Siswa (LKS) Tingkat Provinsi Jawa Barat tahun 2024.",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K"
  };

  const latestNews = [
    {
      title: "Implementasi Kurikulum Merdeka di SMKN 1 Ciamis",
      category: "Akademik",
      date: "12 Februari 2024",
      author: "Tim Kurikulum",
      description: "SMKN 1 Ciamis mulai mengimplementasikan Kurikulum Merdeka untuk meningkatkan kualitas pembelajaran.",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMTgwSDUwMFYyNzBIMzAwVjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMjAwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSAyNUgxMjVWNDVINzVWMjVaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K"
    },
    {
      title: "Workshop Digital Marketing untuk Siswa",
      category: "Kegiatan",
      date: "10 Februari 2024",
      author: "Tim BK",
      description: "SMKN 1 Ciamis mengadakan workshop digital marketing untuk mempersiapkan siswa memasuki dunia industri.",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMTgwSDUwMFYyNzBIMzAwVjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMjAwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSAyNUgxMjVWNDVINzVWMjVaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K"
    }
  ];

  const sidebarNews = [
    {
      tag: "Prestasi",
      title: "Siswa SMKN 1 Ciamis Juara Olimpiade Sains",
      author: "Tim Humas",
      date: "08 Februari 2024"
    },
    {
      tag: "Kegiatan",
      title: "Study Tour ke Industri Teknologi",
      author: "Tim Akademik",
      date: "05 Februari 2024"
    },
    {
      tag: "Akademik",
      title: "Program Magang Kerja Industri 2024",
      author: "Tim BKK",
      date: "03 Februari 2024"
    },
    {
      tag: "Fasilitas",
      title: "Lab Komputer Baru dengan Teknologi Terkini",
      author: "Tim IT",
      date: "01 Februari 2024"
    },
    {
      tag: "Event",
      title: "Peresmian Gedung Baru SMKN 1 Ciamis",
      author: "Tim Humas",
      date: "28 Januari 2024"
    }
  ];

  const allNews = [
    {
      title: "Eum ad dolor et. Autem aut fugiat debitis",
      author: "Julia Parker",
      date: "12 Desember 2023",
      category: "Umum",
      description: "Illum voluptas ab enim placeat. Adipisci enim velit nulla."
    },
    {
      title: "Et repellendus molestiae qui est sed omnis",
      author: "Mario Douglas",
      date: "05 September 2023",
      category: "Prestasi",
      description: "Vel omnis laudantium et illum aute. Quam dolorum et sed."
    },
    {
      title: "Quia assumenda est et veritati",
      author: "Lisa Hunter",
      date: "27 Juli 2023",
      category: "Akademik",
      description: "Ducimus est aut et aut. Autem aut fugiat debitis."
    },
    {
      title: "Pariatur quia facilis similique deleniti",
      author: "Mario Douglas",
      date: "16 September 2023",
      category: "Kegiatan",
      description: "Illum voluptas ab enim placeat. Adipisci enim velit nulla."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Contact Page Style */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background dengan gradien opacity dari atas ke bawah menggunakan warna primary */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }} />
        </div>
        
        {/* School-related floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        {/* News-related illustrations */}
        <div className="absolute top-20 left-10 text-white/10">
          <Newspaper className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <FileText className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <TrendingUp className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Calendar className="w-10 h-10" strokeWidth={1} />
        </div>
        
        {/* School elements */}
        <div className="absolute bottom-32 right-20 text-white/8">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L23 9L12 3Z" />
            <path d="M12 15L12 21" />
            <path d="M8 17L8 21" />
            <path d="M16 17L16 21" />
            <path d="M1 9L1 21L23 21L23 9" />
          </svg>
        </div>
        <div className="absolute top-40 left-40 text-white/8">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 5V19H5V5H19Z" />
            <path d="M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM12 15C14.67 15 17 16.17 17 17.5V19H7V17.5C7 16.17 9.33 15 12 15Z" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
              {header.displayTitle || header.title}
            </h1>
            {header.subtitle && (
              <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {header.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Berita Utama</span>
            <span className="text-xs text-gray-400">02 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Berita terpenting dan terpopuler dari SMKN 1 Ciamis
          </p>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Featured Main */}
            <div className="lg:w-2/3">
              <div className="relative group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={featuredNews.image} 
                    alt={featuredNews.title}
                    className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-[#0268ab] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {featuredNews.category}
                      </span>
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredNews.date}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-[#0268ab]/90 transition-colors">
                      {featuredNews.title}
                    </h2>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      {featuredNews.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <User className="w-4 h-4" />
                        {featuredNews.author}
                      </div>
                      <button className="flex items-center gap-2 text-white bg-[#0268ab] px-4 py-2 rounded-lg hover:bg-[#014a8f] transition-colors text-sm font-medium">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Category Tabs */}
              <div className="flex gap-4 mb-10 border-b border-gray-100 pb-2">
                {newsCategories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveTab(cat)} 
                    className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all ${
                      activeTab === cat 
                        ? 'text-[#0268ab] border-b-2 border-[#0268ab]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Sidebar News List */}
              <div className="space-y-6">
                {sidebarNews.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 rounded-lg flex items-center justify-center">
                          <FileText className="w-8 h-8 text-[#0268ab]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="bg-[#0268ab]/10 text-[#0268ab] text-xs font-bold uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block">
                          {item.tag}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0268ab] transition-colors mb-2 leading-tight">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section - Landing Page Style */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Berita Terbaru</span>
            <span className="text-xs text-gray-400">03 / 04</span>
          </div>
        </div>

        {/* Slider wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Slider track */}
            <div className="flex gap-5 py-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {latestNews.map((news, i) => (
                <div key={i} className="w-72 shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 snap-start">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0268ab]">
                        {news.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] text-gray-400">
                        {news.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#0268ab] transition-colors duration-200 line-clamp-2 mb-2">
                      {news.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {news.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All News Grid Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Semua Berita</span>
            <span className="text-xs text-gray-400">04 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Arsip berita lengkap dari SMKN 1 Ciamis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {allNews.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  {/* Logo SMKN 1 Ciamis - Pojok Bawah Kanan BNW - Half Visible - Larger & More Visible */}
                  <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15">
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src="/images/logosmeabnw.svg" 
                        alt="SMKN 1 Ciamis Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-[#0268ab]" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="bg-[#0268ab]/10 text-[#0268ab] text-xs font-medium px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#0268ab] transition-colors mb-3 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">by {item.author}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <button className="flex items-center gap-2 text-[#0268ab] text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
                      Baca Selengkapnya
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-[#0268ab] transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#0268ab] text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">2</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">3</button>
            <span className="text-gray-400">...</span>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">8</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">9</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">10</button>
            <button className="p-2 text-gray-400 hover:text-[#0268ab] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;


