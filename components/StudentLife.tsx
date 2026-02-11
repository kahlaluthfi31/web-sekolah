
import React from 'react';
import { Camera } from 'lucide-react';

const StudentLife: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Siswa</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Experience a vibrant campus life filled with opportunities for growth, community, and personal discovery.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          <div>
            <span className="text-[#0092DD] text-xs font-bold uppercase tracking-widest mb-3 block">Student Life</span>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              A Community That Inspires Excellence
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We believe that education extends far beyond the classroom. From student-led organizations to cultural festivals and sports events, there's always something happening on campus.
            </p>
            <div className="flex space-x-12 mb-10">
              <div>
                <span className="block text-4xl font-black text-gray-900">85+</span>
                <span className="text-xs text-gray-500 uppercase font-bold">Student Organizations</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-gray-900">150+</span>
                <span className="text-xs text-gray-500 uppercase font-bold">Annual Events</span>
              </div>
            </div>
            <button className="text-gray-900 font-bold border-b-2 border-[#0092DD] pb-1 hover:text-[#0092DD] transition-colors">
              Explore Student Life
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative h-80 rounded-2xl overflow-hidden shadow-lg group">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" alt="Students in group" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center text-xs font-bold text-[#0092DD] shadow-md">
                <Camera className="h-3 w-3 mr-1.5" /> Campus Community
              </div>
            </div>
            <div className="h-48 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://asset.kompas.com/crops/Fz0GKglORY1b7Tmj_aTdwlod_vg=/56x21:728x469/1200x800/data/photo/2022/12/20/63a122762d114.jpg" alt="Classroom" className="w-full h-full object-cover" />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=500" alt="Laboratory" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Triple Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Leadership Development", 
              desc: "Develop crucial leadership skills through our specialized programs and workshops.",
              image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=500"
            },
            { 
              title: "Cultural Diversity", 
              desc: "Celebrate and learn from the diverse backgrounds of our global student body.",
              image: "https://media.istockphoto.com/id/2122148349/id/foto/menulis-ujian-di-universitas.jpg?s=1024x1024&w=is&k=20&c=T5Ap_guLIFlQjBcH7gR_RhAD9dZVNZ817ksM7Q-1h70="
            },
            { 
              title: "Innovation Hub", 
              desc: "A creative space for students to collaborate on groundbreaking projects.",
              image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=500"
            }
          ].map((item, idx) => (
            <div key={idx} className="group">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 shadow-md">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentLife;


