import React from 'react';
import { GraduationCap, Users, Briefcase } from 'lucide-react';

const QuickFeatures: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Edukasi Berkualitas',
      description: 'Program pembelajaran yang terstandarisasi'
    },
    {
      icon: Users,
      title: 'Guru Berpengalaman',
      description: 'Tenaga pendidik profesional dan kompeten'
    },
    {
      icon: Briefcase,
      title: 'Fasilitas Lengkap',
      description: 'Sarana dan prasarana yang memadai'
    }
  ];

  return (
    <div className="relative -mt-16 z-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                  <feature.icon className="w-8 h-8 text-[#2596be]" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickFeatures;
