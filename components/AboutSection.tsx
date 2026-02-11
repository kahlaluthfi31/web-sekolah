
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Sambutan Kepala Sekolah
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              For over three decades, we have been committed to providing exceptional education that prepares students for success in an ever-changing world. Our innovative approach combines traditional academic excellence with cutting-edge technology and personalized learning experiences.
            </p>

            {/* <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#0092DD]">15,000+</span>
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Students Enrolled</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#0092DD]">98%</span>
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Graduate Rate</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#0092DD]">250+</span>
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Expert Faculty</span>
              </div>
            </div> */}

            <div className="relative p-6 bg-gray-50 border-l-4 border-[#0092DD] rounded-r-lg italic text-gray-700 mb-8">
              "Our mission is to foster intellectual curiosity, critical thinking, and lifelong learning while nurturing compassionate leaders who will positively impact their communities and the world."
            </div>

            <button className="bg-[#0092DD] text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#0092DD] transition-all duration-300 transform hover:scale-105 shadow-lg">
              Learn More About Us &rarr;
            </button>
          </div>

          <div className="relative">
            <div className="rounded-2xl ml-10 mb-10 overflow-hidden">
              <img 
                src="/images/web/foto-kepala.png" 
                alt="Kepala Sekolah" 
                className="w-100 h-auto object-cover"
              />
            </div>
            {/* Experience Badge */}
            {/* <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-100">
              <div className="text-center">
                <span className="block text-4xl font-black text-[#0092DD]">32+</span>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Years of Excellence</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


