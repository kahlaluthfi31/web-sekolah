
import React from 'react';
import { ArrowUpRight, Star, Clock, GraduationCap } from 'lucide-react';

const FeaturedPrograms: React.FC = () => {
  const secondaryPrograms = [
    { title: "International Business", category: "Business", duration: "3 Years", degree: "Master's", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE3MCIgdmlld0JveD0iMCAwIDMwMCAxNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjEyNSA2OEgxNzVWMTAySDEyNVY2OFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCA2MCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjM0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNy45IDEzLjVIMzIuMVYyMC41SDI3LjlWMTMuNVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Medical Technology", category: "Health Sciences", duration: "5 Years", degree: "Bachelor's", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE3MCIgdmlld0JveD0iMCAwIDMwMCAxNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjEyNSA2OEgxNzVWMTAySDEyNVY2OFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCA2MCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjM0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNy45IDEzLjVIMzIuMVYyMC41SDI3LjlWMTMuNVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Digital Media & Design", category: "Creative Arts", duration: "3 Years", degree: "Bachelor's", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE3MCIgdmlld0JveD0iMCAwIDMwMCAxNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjEyNSA2OEgxNzVWMTAySDEyNVY2OFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCA2MCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjM0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNy45IDEzLjVIMzIuMVYyMC41SDI3LjlWMTMuNVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Environmental Studies", category: "Science", duration: "4 Years", degree: "Bachelor's", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE3MCIgdmlld0JveD0iMCAwIDMwMCAxNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjEyNSA2OEgxNzVWMTAySDEyNVY2OFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCA2MCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjM0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNy45IDEzLjVIMzIuMVYyMC41SDI3LjlWMTMuNVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K" }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Featured Programs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover a world of possibilities with our diverse range of undergraduate and graduate programs.</p>
        </div>

        {/* Discovery Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h3 className="text-3xl font-bold mb-6">Discover Excellence in Education</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">Our curriculum is designed to challenge students and provide them with the tools they need to succeed in their chosen careers. We focus on practical skills, research, and innovation.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <span className="block text-2xl font-bold">2,500+</span>
                <span className="text-xs text-gray-500 font-semibold uppercase">Active Students</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">98%</span>
                <span className="text-xs text-gray-500 font-semibold uppercase">Graduate Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">50+</span>
                <span className="text-xs text-gray-500 font-semibold uppercase">Programs Offered</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
            <img src="/images/default-campus.svg" alt="University Campus" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMTgwSDUwMFYyNzBIMzAwVjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMjAwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSAyNUgxMjVWNDVINzVWMjVaIiBmaWxsPSIjRDFENUVCIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K"
                alt="CS & AI"
                width={800}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={true}
              />
              <div className="absolute top-4 left-4 bg-[#2596be] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center">
                <Star className="h-3 w-3 mr-1 fill-white" /> Top Rated
              </div>
            </div>
            <div className="p-8">
              <span className="text-[#2596be] text-xs font-bold uppercase tracking-widest mb-2 block">Engineering</span>
              <h4 className="text-2xl font-bold mb-4">Computer Science & AI</h4>
              <p className="text-gray-600 mb-6 line-clamp-2">Master the latest technologies in artificial intelligence, machine learning, and software engineering with our industry-led program.</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> 4 Years</div>
                <div className="flex items-center"><GraduationCap className="h-4 w-4 mr-1" /> Bachelor's</div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button className="text-[#2596be] font-bold text-sm hover:underline">Learn More</button>
                <span className="text-xs text-gray-400">320 enrolled</span>
              </div>
            </div>
          </div>

          {/* List Style Secondary */}
          <div className="space-y-4">
            {secondaryPrograms.map((prog, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 flex items-center shadow-md border border-gray-100 group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={prog.image} alt={prog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="ml-6 flex-grow">
                  <span className="text-[#2596be] text-[10px] font-bold uppercase tracking-widest">{prog.category}</span>
                  <h5 className="font-bold text-gray-900 group-hover:text-[#2596be] transition-colors">{prog.title}</h5>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>{prog.duration}</span>
                    <span>{prog.degree}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full border border-gray-200 text-gray-400 group-hover:bg-[#2596be] group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;


