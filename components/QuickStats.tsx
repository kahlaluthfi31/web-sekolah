
import React from 'react';
import { GraduationCap, Users, Globe } from 'lucide-react';

const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: <GraduationCap className="h-8 w-8 text-[#2596be]" />,
      title: "98% Graduate Success",
      desc: "Our graduates consistently secure high-tier positions within 6 months of graduation."
    },
    {
      icon: <Users className="h-8 w-8 text-[#2596be]" />,
      title: "16:1 Student-Faculty Ratio",
      desc: "Small class sizes ensure personalized attention and mentorship for every student."
    },
    {
      icon: <Globe className="h-8 w-8 text-[#2596be]" />,
      title: "Global Community",
      desc: "Students from over 65 countries creating a vibrant, multicultural learning environment."
    }
  ];

  return (
    <div className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center text-center hover:translate-y-[-5px] transition-transform duration-300">
            <div className="mb-4 p-4 bg-[#2596be]/10 rounded-full">
              {stat.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Campus Event Banner */}
      <div className="mt-8 bg-[#2596be] rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row items-stretch">
        <div className="bg-[#77C5F0] px-10 py-6 flex flex-col items-center justify-center text-white min-w-[150px]">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Oct</span>
          <span className="text-4xl font-extrabold">28</span>
        </div>
        <div className="flex-grow p-6 flex flex-col md:flex-row md:items-center justify-between text-white gap-4">
          <div>
            <h4 className="text-xl font-bold">Open Campus Day</h4>
            <p className="text-white/80 text-sm">Experience our vibrant campus life, meet faculty members, and learn about our academic programs.</p>
          </div>
          <button className="whitespace-nowrap bg-white text-[#2596be] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;


