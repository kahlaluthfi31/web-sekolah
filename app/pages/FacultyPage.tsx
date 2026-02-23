
import React, { useState } from 'react';
import { Search, Linkedin, Mail, Globe } from 'lucide-react';

const FacultyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const facultyMembers = [
    { name: "Dr. Marcus Thompson", title: "Professor of Computer Science", school: "School of Technology", tags: ["Artificial Intelligence", "Data Science"], img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. Sophia Chang", title: "Associate Professor of Biology", school: "Department of Life Sciences", tags: ["Marine Biology", "Ecology"], img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. James Anderson", title: "Assistant Professor of Physics", school: "Department of Physical Sciences", tags: ["Quantum Computing", "Theoretical Physics"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. Rachel Kim", title: "Professor of Psychology", school: "College of Social Sciences", tags: ["Cognitive Psychology", "Behavioral Analysis"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. David Wilson", title: "Associate Professor of Economics", school: "Business School", tags: ["Financial Markets", "Economic Policy"], img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. Isabella Martinez", title: "Assistant Professor of Literature", school: "College of Humanities", tags: ["Contemporary Fiction", "Cultural Studies"], img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. Robert Taylor", title: "Professor of Mathematics", school: "Department of Math", tags: ["Pure Mathematics", "Topology"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=500" },
    { name: "Dr. Emily Brown", title: "Associate Professor of Art", school: "School of Fine Arts", tags: ["Sculpture", "Modern Art"], img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500" }
  ];

  const filteredFaculty = facultyMembers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Struktur Sekolah</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Struktur Sekolah
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Search Bar */}
           <div className="max-w-2xl mx-auto mb-20 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find faculty by name or expertise..." 
                className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-6 shadow-md outline-none focus:ring-2 focus:ring-[#0092DD]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Featured Faculty */}
           <div className="mb-24 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/3">
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-xl w-full h-[350px] object-cover" alt="Featured Faculty" />
              </div>
              <div className="w-full md:w-2/3">
                 <span className="bg-[#0092DD]/10 text-[#0092DD] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Featured Faculty</span>
                 <h2 className="text-4xl font-bold text-gray-900 mb-2">Dr. Elena Rodriguez</h2>
                 <p className="text-[#0092DD] text-sm font-bold mb-6">Dean of Engineering & Professor of Mechanical Engineering</p>
                 <p className="text-gray-500 text-sm leading-relaxed mb-8">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                 </p>
                 <div className="flex flex-wrap gap-2 mb-8">
                    {["Robotics", "Renewable Energy", "Sustainable Design"].map(tag => (
                      <span key={tag} className="bg-gray-100 px-4 py-1 rounded-full text-[10px] text-gray-600 font-bold">{tag}</span>
                    ))}
                 </div>
                 <div className="flex items-center space-x-6">
                    <button className="bg-[#0092DD] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#77C5F0] hover:text-[#0092DD] transition-colors shadow-lg">Contact</button>
                    <div className="flex space-x-4 text-gray-400">
                       <Linkedin className="h-5 w-5 cursor-pointer hover:text-[#0092DD]" />
                       <Mail className="h-5 w-5 cursor-pointer hover:text-[#0092DD]" />
                       <Globe className="h-5 w-5 cursor-pointer hover:text-[#0092DD]" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Grid 4 columns requested */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredFaculty.map((member, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
                   <div className="h-48 overflow-hidden">
                      <img src={member.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={member.name} />
                   </div>
                   <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-[#0092DD] text-[10px] font-bold mb-1">{member.title}</p>
                      <p className="text-gray-400 text-[10px] mb-4">{member.school}</p>
                      <div className="flex flex-wrap gap-1 mb-6">
                         {member.tags.map(tag => (
                           <span key={tag} className="bg-gray-50 px-2 py-0.5 rounded text-[8px] text-gray-500 border border-gray-100">{tag}</span>
                         ))}
                      </div>
                      <button className="text-xs font-bold text-[#0092DD] hover:underline flex items-center">
                        View Profile <span className="ml-1 text-[10px]">&rarr;</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-20 text-center">
              <button className="border-2 border-gray-200 text-gray-900 px-10 py-3 rounded-full font-bold hover:border-[#0092DD] hover:text-[#0092DD] transition-all">Show More Faculty</button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyPage;


