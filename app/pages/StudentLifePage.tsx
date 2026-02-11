
import React from 'react';
import { Camera, Users, GraduationCap, Globe } from 'lucide-react';

const StudentLifePage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Student Life</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Esse dolorum voluptatum ullam est sint nemo et est ipsa porro placeat quibusdam quia assumenda nunquam molestias.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Students Life
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">Campus Life Experience</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Discover a vibrant community where learning extends beyond the classroom. Our students engage in diverse activities that shape their academic journey and personal growth.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <span className="block text-4xl font-black text-[#0092DD]">150</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Student Organizations</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-4xl font-black text-[#0092DD]">85</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Graduation Rate</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-4xl font-black text-[#0092DD]">12</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Student-Faculty Ratio</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[450px]">
                <img src="https://media.istockphoto.com/id/2226385991/id/foto/sekelompok-siswa-yang-bahagia-belajar-bersama-di-perpustakaan.jpg?s=1024x1024&w=is&k=20&c=vuczzsaTJeFI2tDVuFwhei_hr56vvKfCAImJEzvbPAM=" className="w-full h-full object-cover" alt="Student Life" />
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-2xl overflow-hidden border-8 border-white shadow-2xl hidden md:block">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover" alt="Secondary" />
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Life Beyond Academics</h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">Every day brings new opportunities to explore interests, build friendships, and develop skills that last a lifetime.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Research & Innovation", desc: "Engage in cutting-edge research projects alongside faculty mentors. Explore new frontiers in your field while contributing to meaningful discoveries.", img: "https://media.istockphoto.com/id/2226813041/id/foto/mahasiswi-berbicara-dengan-seorang-teman-sambil-belajar-bersama-di-perpustakaan.jpg?s=1024x1024&w=is&k=20&c=tkhph3rK-doIOtQTKs6f2eyyaXi5LGExLjV3SdVWkro=" },
             { title: "Cultural Exchange", desc: "Participate in international programs and cultural events. Broaden your perspective through diverse experiences and global connections.", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600" },
             { title: "Sports & Recreation", desc: "Stay active with our comprehensive athletics program. Join competitive teams or enjoy recreational activities in state-of-the-art facilities.", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600" }
           ].map((item, i) => (
             <div key={i} className="bg-white rounded-3xl overflow-hidden group shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                   <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                </div>
                <div className="p-8">
                   <h4 className="font-bold text-lg text-gray-900 mb-4">{item.title}</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Sarah Chen" />
          </div>
          <div>
            <div className="mb-10">
               <span className="text-[#0092DD] text-3xl font-black opacity-20 block mb-2">"</span>
               <p className="text-2xl font-bold text-gray-900 leading-tight italic mb-8">
                 "The support system here is incredible. From academic advisors to career counselors, everyone is invested in your success. I've grown not just as a student, but as a person ready to make a difference in the world."
               </p>
               <div>
                  <h5 className="font-bold text-lg">Sarah Chen</h5>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Computer Science Major, Class of 2024</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLifePage;


