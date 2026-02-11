
import React from 'react';
import { ArrowRight, MessageSquare, Mic, Network } from 'lucide-react';

const AlumniPage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Alumni</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Alumni
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
             <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">Our Alumni Legacy</h2>
             <p className="text-gray-500 mb-10 leading-relaxed">
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae ultricies eget, tempor sit amet ante. Donec eu libero sit amet quam egestas semper.
             </p>
             <div className="flex gap-12">
                <div>
                  <span className="block text-4xl font-black text-[#0092DD]">42K</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Graduates</span>
                </div>
                <div>
                  <span className="block text-4xl font-black text-[#0092DD]">95</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Countries</span>
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/2 rounded-[40px] overflow-hidden shadow-2xl h-[450px]">
             <img src="https://media.istockphoto.com/id/1622296148/id/foto/potret-seorang-lulusan-universitas-wanita-asia-mengenakan-gaun-wisuda-merayakan-pencapaian.jpg?s=2048x2048&w=is&k=20&c=NlJOXTz6Z5jAzOF6jC7DeJST8EbS4M9RSTbkXs1nVT0=" className="w-full h-full object-cover" alt="Alumni" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-sm text-gray-400">Hear from our graduates who are making a significant impact in their respective fields.</p>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Alexander Mitchell", role: "Tech Entrepreneur", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" },
              { name: "Rachel Thompson", role: "Environmental Scientist", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300" },
              { name: "David Chen", role: "Social Impact Leader", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" }
            ].map((story, i) => (
              <div key={i} className="text-center group">
                 <div className="relative inline-block mb-8">
                    <img src={story.img} className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-300" alt={story.name} />
                    <div className="absolute -bottom-2 -right-2 bg-[#0092DD] text-white text-[8px] font-bold px-2 py-1 rounded-full">'20</div>
                 </div>
                 <h4 className="font-bold text-lg mb-1">{story.name}</h4>
                 <p className="text-[#0092DD] text-[10px] font-bold uppercase mb-4">{story.role}</p>
                 <p className="text-xs text-gray-500 leading-relaxed mb-8 px-4">
                   Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
                 </p>
                 <button className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b-2 border-[#0092DD] pb-1 hover:text-[#0092DD] transition-colors">Read Story</button>
              </div>
            ))}
         </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Ways to Engage</h2>
              <p className="text-gray-500 text-sm mb-12 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
              <div className="space-y-8">
                 <div className="flex items-start gap-6 group cursor-pointer">
                    <div className="bg-[#0092DD]/10 p-4 rounded-2xl text-[#0092DD] group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                       <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 mb-2">Mentorship</h4>
                       <p className="text-xs text-gray-500 mb-2">Guide current students in their academic and career journey.</p>
                       <span className="text-[10px] font-bold text-[#0092DD] uppercase cursor-pointer hover:underline">Learn More</span>
                    </div>
                 </div>
                 <div className="flex items-start gap-6 group cursor-pointer">
                    <div className="bg-[#0092DD]/10 p-4 rounded-2xl text-[#0092DD] group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                       <Mic className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 mb-2">Speaking</h4>
                       <p className="text-xs text-gray-500 mb-2">Share your expertise through guest lectures and workshops.</p>
                       <span className="text-[10px] font-bold text-[#0092DD] uppercase cursor-pointer hover:underline">Learn More</span>
                    </div>
                 </div>
                 <div className="flex items-start gap-6 group cursor-pointer">
                    <div className="bg-[#0092DD]/10 p-4 rounded-2xl text-[#0092DD] group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                       <Network className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 mb-2">Networking</h4>
                       <p className="text-xs text-gray-500 mb-2">Build professional connections within our global community.</p>
                       <span className="text-[10px] font-bold text-[#0092DD] uppercase cursor-pointer hover:underline">Learn More</span>
                    </div>
                 </div>
              </div>
           </div>
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Classroom" />
           </div>
        </div>
      </section>

      {/* Banner Strip */}
      <section className="relative h-[250px] flex items-center justify-center overflow-hidden">
         <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
         <div className="absolute inset-0 bg-[#0092DD]/80 backdrop-blur-sm"></div>
         <div className="relative z-10 text-center text-white">
            <span className="text-6xl font-black block mb-2">$3.8M</span>
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Scholarships funded</span>
         </div>
      </section>

      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Creating Lasting Impact</h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.</p>
            <div className="flex justify-center gap-4">
               <button className="bg-[#0092DD] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-[#77C5F0] hover:text-[#0092DD] transition-colors">Support Students</button>
               <button className="border-2 border-gray-100 px-8 py-3 rounded-lg font-bold hover:border-[#0092DD] transition-all">View Impact Report</button>
            </div>
         </div>
      </section>

      <section className="py-24 bg-gray-50 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex justify-between items-end">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <button className="text-[10px] font-bold uppercase text-[#0092DD] flex items-center hover:underline">View All Events <ArrowRight className="ml-2 h-3 w-3" /></button>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {[
              { date: "AUG 24", title: "Annual Alumni Gala", loc: "Metropolitan Convention Center", time: "7:00 PM - 11:00 PM" },
              { date: "SEP 15", title: "Career Networking Breakfast", loc: "University Alumni Center", time: "8:30 AM - 10:30 AM" },
              { date: "OCT 08", title: "Homecoming Weekend", loc: "Main Campus", time: "All Weekend" }
            ].map((ev, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex flex-col items-center min-w-[80px]">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ev.date.split(' ')[0]}</span>
                    <span className="text-4xl font-black text-[#0092DD] leading-none">{ev.date.split(' ')[1]}</span>
                 </div>
                 <div className="flex-grow">
                    <h4 className="font-bold text-xl mb-3">{ev.title}</h4>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-400 font-medium">
                       <span>{ev.loc}</span>
                       <span>{ev.time}</span>
                    </div>
                 </div>
                 <button className="text-[10px] font-bold text-[#0092DD] uppercase hover:underline">Register Now</button>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default AlumniPage;


