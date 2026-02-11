
import React from 'react';
import { ArrowUpRight, Star, Clock, GraduationCap } from 'lucide-react';

const FeaturedPrograms: React.FC = () => {
  const secondaryPrograms = [
    { title: "International Business", category: "Business", duration: "3 Years", degree: "Master's", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300" },
    { title: "Medical Technology", category: "Health Sciences", duration: "5 Years", degree: "Bachelor's", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300" },
    { title: "Digital Media & Design", category: "Creative Arts", duration: "3 Years", degree: "Bachelor's", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=300" },
    { title: "Environmental Studies", category: "Science", duration: "4 Years", degree: "Bachelor's", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300" }
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
            <img src="https://cdn.antaranews.com/cache/1200x800/2023/04/13/WhatsApp-Image-2023-04-13-at-16.28.02.jpeg" alt="University Campus" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
            <div className="relative h-64 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" alt="CS & AI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-[#0092DD] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center">
                <Star className="h-3 w-3 mr-1 fill-white" /> Top Rated
              </div>
            </div>
            <div className="p-8">
              <span className="text-[#0092DD] text-xs font-bold uppercase tracking-widest mb-2 block">Engineering</span>
              <h4 className="text-2xl font-bold mb-4">Computer Science & AI</h4>
              <p className="text-gray-600 mb-6 line-clamp-2">Master the latest technologies in artificial intelligence, machine learning, and software engineering with our industry-led program.</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> 4 Years</div>
                <div className="flex items-center"><GraduationCap className="h-4 w-4 mr-1" /> Bachelor's</div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button className="text-[#0092DD] font-bold text-sm hover:underline">Learn More</button>
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
                  <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-widest">{prog.category}</span>
                  <h5 className="font-bold text-gray-900 group-hover:text-[#0092DD] transition-colors">{prog.title}</h5>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>{prog.duration}</span>
                    <span>{prog.degree}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full border border-gray-200 text-gray-400 group-hover:bg-[#0092DD] group-hover:text-white transition-colors">
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


