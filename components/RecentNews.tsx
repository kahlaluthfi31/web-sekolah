
import React from 'react';
import { ArrowRight } from 'lucide-react';

const RecentNews: React.FC = () => {
  const news = [
    {
      date: "Tue, December 12",
      author: "Julia Parker",
      title: "New Research Grant for Sustainable Tech Lab",
      image: "https://media.istockphoto.com/id/2155834419/id/foto/mahasiswa-belajar-selama-kelas-di-ruang-kuliah.jpg?s=1024x1024&w=is&k=20&c=MWxKI8l7ZvzbNImEn5uorZ7aRwkRryQ2N4ie-RC0iQU=",
      desc: "Our engineering department has secured a prestigious $2M grant to further green research..."
    },
    {
      date: "Fri, September 05",
      author: "Mario Douglas",
      title: "Campus Sustainability Index Hits Record High",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500",
      desc: "Following our zero-waste initiative, campus energy efficiency has improved by 40%..."
    },
    {
      date: "Tue, July 27",
      author: "Lisa Hunter",
      title: "International Alumni Meet 2024 Announced",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=500",
      desc: "Registration is now open for our annual global alumni gathering in Singapore this winter..."
    },
    {
      date: "Tue, Sep 16",
      author: "Mario Douglas",
      title: "Dean's List for Summer Semester Released",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
      desc: "Congratulations to our outstanding students who made it to the Dean's list this semester..."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Berita Terbaru</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest happenings, research breakthroughs, and community announcements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">
                <span>{item.date}</span>
                <span className="mx-2">/</span>
                <span>{item.author}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0092DD] transition-colors line-clamp-2 leading-tight">{item.title}</h4>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{item.desc}</p>
              <button className="flex items-center text-[#0092DD] text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
                Read More <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentNews;


