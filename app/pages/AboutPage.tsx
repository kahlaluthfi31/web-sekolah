
import React from 'react';
import { Star, GraduationCap, Users, Globe, Lightbulb, UserCheck, TrendingUp, Linkedin, Mail, Globe as GlobeIcon } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> About
        </div>
      </div>

      {/* Innovators Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Excellence in Education</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Shaping Tomorrow's Innovators<br />Through Progressive Learning</h2>
          <p className="max-w-3xl mx-auto text-gray-500 leading-relaxed">
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.
          </p>
        </div>

        {/* Visionary Leadership Circles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Visionary Leadership</h3>
            <p className="max-w-2xl text-gray-500 leading-relaxed">
              Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat. Vivamus suscipit tortor eget felis porttitor volutpat.
            </p>
          </div>

          <div className="relative h-[400px] flex items-center justify-center">
             {/* Center Person - Sarah Chen */}
             <div className="absolute left-0 lg:left-24 max-w-sm bg-white p-6 rounded-2xl shadow-xl flex items-start z-10">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" className="w-20 h-20 rounded-full object-cover mr-4" alt="Dr. Sarah Chen" />
               <div>
                 <h4 className="font-bold text-gray-900">Dr. Sarah Chen</h4>
                 <p className="text-[#0092DD] text-xs font-bold mb-2 uppercase">Academic Director</p>
                 <p className="text-gray-400 text-[10px] leading-relaxed">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel.</p>
               </div>
             </div>

             {/* Right Floating Circles */}
             <div className="absolute right-0 lg:right-48 flex flex-col items-center gap-16">
                <div className="text-center">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg" alt="Prof. Michael Torres" />
                  <h5 className="font-bold text-sm">Prof. Michael Torres</h5>
                  <p className="text-[#0092DD] text-[10px] font-bold">Dean of Sciences</p>
                </div>
                <div className="flex gap-20">
                  <div className="text-center">
                    <img src="https://media.istockphoto.com/id/1364176807/id/foto/profesor-mengajar-tata-bahasa-inggris-secara-online.jpg?s=1024x1024&w=is&k=20&c=MOhRZ_RjJJhMfH1KDt9Ee7ScpCOAZVmL82Zi0BQvyXI=" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg" alt="Dr. Elena Rodriguez" />
                    <h5 className="font-bold text-xs">Dr. Elena Rodriguez</h5>
                    <p className="text-[#0092DD] text-[10px] font-bold">Research Coordinator</p>
                  </div>
                  <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg" alt="Dr. James Wilson" />
                    <h5 className="font-bold text-xs">Dr. James Wilson</h5>
                    <p className="text-[#0092DD] text-[10px] font-bold">Innovation Director</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Our Foundation</span>
          <h2 className="text-3xl font-bold text-gray-900">Core Values & Principles</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { id: "01", title: "Innovation", desc: "Proin eget tortor risus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar." },
            { id: "02", title: "Integrity", desc: "Vestibulum ac diam sit amet quam vehicula elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas." },
          ].map((val) => (
            <div key={val.id} className="relative pt-8">
              <span className="absolute top-0 left-0 text-6xl font-black text-gray-50 -z-0">{val.id}</span>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-gray-900 mb-4">{val.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Measurable Excellence Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://media.istockphoto.com/id/1979762251/id/foto/mahasiswa-memiliki-ujian-di-kelas-di-ruang-kuliah.jpg?s=1024x1024&w=is&k=20&c=GAdzRTh8g88BANyDRgRExl3oeAa3i-0nG5ciqbbKI8o=" className="w-full h-[400px] object-cover" alt="Campus View" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-2xl text-center border border-gray-100">
              <span className="block text-4xl font-black text-gray-900 mb-1">25+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Years Excellence</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Our Impact</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Measurable Excellence in Education</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.
            </p>
            <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-10">
              <div>
                <span className="block text-2xl font-bold text-gray-900 mb-1">15,000+</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">Successful Graduates</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-900 mb-1">98%</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">Employment Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-900 mb-1">45</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">International Partners</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-900 mb-1">300+</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">Expert Faculty</span>
              </div>
            </div>
            <ul className="space-y-3 text-xs font-semibold text-gray-600">
              <li className="flex items-center"><UserCheck className="h-4 w-4 text-[#0092DD] mr-2" /> Nationally Accredited Institution</li>
              <li className="flex items-center"><Star className="h-4 w-4 text-[#0092DD] mr-2" /> Excellence in Teaching Award 2024</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Visionary Leaders Detailed Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
             <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Leadership Excellence</span>
             <h2 className="text-3xl font-bold text-gray-900 mb-6">Visionary Leaders Shaping<br />Tomorrow's Education</h2>
             <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed text-sm">
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae ultricies eget, tempor sit amet ante. Donec eu libero sit amet quam egestas semper.
             </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column - Featured Leader */}
             <div className="lg:col-span-1">
               <div className="bg-white rounded-2xl overflow-hidden shadow-xl group sticky top-24">
                 <div className="h-96 relative">
                   <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Dr. Margaret Thompson" />
                 </div>
                 <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Dr. Margaret Thompson</h3>
                    <p className="text-[#0092DD] text-xs font-bold mb-6 uppercase">Principal & Educational Director</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris viverra veniam sit amet lacus cursus venenatis. Etiam consectetur aliquam lorem quis viverra.
                    </p>
                    <div className="flex gap-8 mb-8 border-t border-gray-100 pt-6">
                      <div className="text-center">
                        <span className="block text-xl font-bold">15</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Years Leading</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-xl font-bold">250+</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Graduates</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-xl font-bold">PhD</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Education</span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Linkedin className="h-4 w-4 text-gray-400 cursor-pointer hover:text-[#0092DD]" />
                      <Mail className="h-4 w-4 text-gray-400 cursor-pointer hover:text-[#0092DD]" />
                      <GlobeIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-[#0092DD]" />
                    </div>
                 </div>
               </div>
             </div>

             {/* Right Columns - Team Grid */}
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "James Wilson", title: "Vice Principal", desc: "Nunc dignissim risus id metus molestie tempor. Cras vestibulum bibendum augue praesent mattis.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500" },
                  { name: "Elena Rodriguez", title: "Academic Coordinator", desc: "Praesent sapien massa convallis a pellentesque nec egestas non nisi cras adipiscing.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=500" },
                  { name: "Michael Chen", title: "Student Affairs Director", desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500" },
                  { name: "Sarah Mitchell", title: "Curriculum Head", desc: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" },
                  { name: "David Kumar", title: "Operations Manager", desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500" },
                  { name: "Lisa Anderson", title: "Admissions Director", desc: "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500" }
                ].map((member, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col group">
                    <img src={member.img} className="w-full h-48 object-cover rounded-xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300" alt={member.name} />
                    <h4 className="font-bold text-gray-900">{member.name}</h4>
                    <p className="text-[#0092DD] text-[10px] font-bold mb-4 uppercase">{member.title}</p>
                    <p className="text-gray-500 text-[10px] leading-relaxed mb-6">{member.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </section>

      {/* Leadership Philosophy Section */}
      <section className="py-24 bg-[#fff9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership Philosophy</h2>
          <p className="max-w-3xl mx-auto text-gray-500 text-sm leading-relaxed mb-16">
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec rutrum congue leo eget malesuada. Nulla porttitor accumsan tincidunt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Lightbulb className="h-6 w-6" />, title: "Innovation-driven educational approach" },
              { icon: <UserCheck className="h-6 w-6" />, title: "Student-centered leadership practices" },
              { icon: <TrendingUp className="h-6 w-6" />, title: "Continuous improvement mindset" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-[#0092DD] mb-4">
                  {item.icon}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


