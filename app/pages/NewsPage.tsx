
import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Top stories');

  const newsCategories = ['Top stories', 'Trending News', 'Latest News'];

  const newsGrid = [
    { title: "Eum ad dolor et. Autem aut fugiat debitis", author: "Julia Parker", date: "Tue, December 12", img: "https://media.istockphoto.com/id/504534696/id/foto/siswa-dalam-kunjungan-lapangan.jpg?s=1024x1024&w=is&k=20&c=UpRmqmJ5Zlvv2srGyqYx4StEfxRTmafWAcCOCKVk8cI=" },
    { title: "Et repellendus molestiae qui est sed omnis", author: "Mario Douglas", date: "Fri, September 05", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500" },
    { title: "Quia assumenda est et veritati", author: "Lisa Hunter", date: "Tue, July 27", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=500" },
    { title: "Pariatur quia facilis similique deleniti", author: "Mario Douglas", date: "Tue, Sep 16", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500" }
  ];

  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">News</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> News
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-16">
            <div className="w-full lg:w-2/3">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] group mb-8">
                 <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured News" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                    <span className="bg-[#0092DD] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-4 w-fit">Politics / 02/15/2024</span>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Optimizing Strategic Initiatives Through Cross-Functional Collaboration</h2>
                    <p className="text-white/70 text-sm mb-6 max-w-xl">Leveraging core competencies to drive sustainable growth and maximize stakeholder value through innovative solutions and market-driven approaches.</p>
                    <p className="text-white text-xs font-bold">by Jennifer Mitchell</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="group cursor-pointer">
                    <div className="rounded-2xl overflow-hidden h-64 mb-6 shadow-md">
                       <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Agile" />
                    </div>
                    <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-widest mb-2 block">Politics / 03/21/2024</span>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#0092DD] transition-colors mb-4">Implementing Agile Methodologies for Enhanced Business Performance</h3>
                    <p className="text-xs text-gray-400">by Robert Anderson</p>
                 </div>
                 <div className="group cursor-pointer">
                    <div className="rounded-2xl overflow-hidden h-64 mb-6 shadow-md">
                       <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Operations" />
                    </div>
                    <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-widest mb-2 block">Business / 01/30/2024</span>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#0092DD] transition-colors mb-4">Streamlining Operations Through Digital Transformation Solutions</h3>
                    <p className="text-xs text-gray-400">by Sarah Thompson</p>
                 </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3">
               <div className="flex gap-4 mb-10 border-b border-gray-100 pb-2">
                  {newsCategories.map(cat => (
                    <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[10px] font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === cat ? 'text-[#0092DD] border-b-2 border-[#0092DD]' : 'text-gray-400'}`}>
                      {cat}
                    </button>
                  ))}
               </div>
               <div className="space-y-8">
                  {[
                    { tag: "Science", title: "Maximizing ROI Through Strategic Resource Allocation", author: "Michael Davidson", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=150" },
                    { tag: "Travel", title: "Leveraging Big Data Analytics for Market Intelligence", author: "Emily Richardson", img: "https://media.istockphoto.com/id/504534788/id/foto/siswa-pergi-ke-sekolah.jpg?s=1024x1024&w=is&k=20&c=GJf8hVo8LGMb4PsrSShZn9JtMrczPDMXm3UnwlYRLEY=" },
                    { tag: "Politics", title: "Enhancing Customer Experience Through Digital Innovation", author: "Daniel Cooper", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=150" },
                    { tag: "Technology", title: "Transforming Business Models Through Digital Innovation", author: "Rachel Stevens", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=150" },
                    { tag: "Finance", title: "Strategic Investment Planning for Sustainable Growth", author: "Andrew Phillips", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                       <img src={item.img} className="w-16 h-16 rounded-lg object-cover" alt={item.tag} />
                       <div>
                          <span className="bg-[#0092DD] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2 inline-block">{item.tag}</span>
                          <h4 className="text-xs font-bold leading-tight group-hover:text-[#0092DD] transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-1">by {item.author}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
             {newsGrid.map((item, i) => (
               <div key={i} className="group cursor-pointer">
                  <div className="rounded-2xl overflow-hidden h-48 mb-6 shadow-sm border border-gray-100">
                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{item.date} / {item.author}</div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#0092DD] transition-colors mb-4 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-6 leading-relaxed">Illum voluptas ab enim placeat. Adipisci enim velit nulla. Vel omnis laudantium.</p>
                  <button className="flex items-center text-[#0092DD] text-[10px] font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
               </div>
             ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-[#0092DD] transition-colors"><ChevronLeft className="h-4 w-4" /></button>
             <button className="w-8 h-8 rounded-full bg-[#0092DD] text-white text-xs font-bold">1</button>
             <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">2</button>
             <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">3</button>
             <span className="text-gray-400">...</span>
             <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">8</button>
             <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">9</button>
             <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100 transition-colors">10</button>
             <button className="p-2 text-gray-400 hover:text-[#0092DD] transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;


