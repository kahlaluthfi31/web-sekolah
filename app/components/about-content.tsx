
import React from 'react';
import { Star, GraduationCap, Users, Globe, Lightbulb, UserCheck, TrendingUp, Linkedin, Mail, Globe as GlobeIcon } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Profile Sekolah</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Profil Sekolah
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
                 <p className="text-xs text-gray-400 leading-relaxed mb-3">Leading curriculum development and academic excellence initiatives across all departments.</p>
                 <div className="flex gap-2">
                   <a href="#" className="text-gray-400 hover:text-[#0092DD] transition-colors"><Linkedin className="h-4 w-4" /></a>
                   <a href="#" className="text-gray-400 hover:text-[#0092DD] transition-colors"><Mail className="h-4 w-4" /></a>
                 </div>
               </div>
             </div>

             {/* Right Person - Michael Rodriguez */}
             <div className="absolute right-0 lg:right-24 max-w-sm bg-white p-6 rounded-2xl shadow-xl flex items-start z-10">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" className="w-20 h-20 rounded-full object-cover mr-4" alt="Michael Rodriguez" />
               <div>
                 <h4 className="font-bold text-gray-900">Michael Rodriguez</h4>
                 <p className="text-[#0092DD] text-xs font-bold mb-2 uppercase">Innovation Officer</p>
                 <p className="text-xs text-gray-400 leading-relaxed mb-3">Driving technological integration and fostering entrepreneurial mindset among students.</p>
                 <div className="flex gap-2">
                   <a href="#" className="text-gray-400 hover:text-[#0092DD] transition-colors"><Linkedin className="h-4 w-4" /></a>
                   <a href="#" className="text-gray-400 hover:text-[#0092DD] transition-colors"><GlobeIcon className="h-4 w-4" /></a>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Vision Mission Values */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0092DD] to-[#77C5F0] text-white p-12 rounded-3xl shadow-xl">
              <Star className="h-10 w-10 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                To be a globally recognized institution that inspires innovation, fosters critical thinking, and cultivates leaders who shape a better tomorrow.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 p-12 rounded-3xl shadow-xl border border-gray-200">
              <GraduationCap className="h-10 w-10 mb-6 text-[#0092DD]" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To provide transformative education through rigorous academics, experiential learning, and holistic development that prepares students for global citizenship.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 p-12 rounded-3xl shadow-xl border border-gray-200">
              <Lightbulb className="h-10 w-10 mb-6 text-[#0092DD]" />
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Excellence, Integrity, Innovation, Inclusivity, and Community. These core values guide every decision and shape our educational approach.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="bg-gradient-to-r from-[#0092DD] to-[#77C5F0] rounded-3xl p-16 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <Users className="h-8 w-8 mb-4 mx-auto" />
                <div className="text-4xl font-bold mb-2">12,000+</div>
                <div className="text-sm text-white/70 uppercase font-bold">Active Students</div>
              </div>
              <div>
                <GraduationCap className="h-8 w-8 mb-4 mx-auto" />
                <div className="text-4xl font-bold mb-2">850+</div>
                <div className="text-sm text-white/70 uppercase font-bold">Expert Faculty</div>
              </div>
              <div>
                <Globe className="h-8 w-8 mb-4 mx-auto" />
                <div className="text-4xl font-bold mb-2">95+</div>
                <div className="text-sm text-white/70 uppercase font-bold">Countries Represented</div>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 mb-4 mx-auto" />
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-sm text-white/70 uppercase font-bold">Graduate Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Sets Us Apart</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Experience an education that goes beyond textbooks, preparing you for real-world challenges and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <GraduationCap className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">World-Class Faculty</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Learn from renowned experts and industry leaders committed to your success.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <Lightbulb className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cutting-Edge Research</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Engage in groundbreaking research projects that shape the future.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <Globe className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Network</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Connect with peers and alumni worldwide through our extensive network.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <UserCheck className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Receive individualized guidance throughout your academic journey.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <TrendingUp className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Career Excellence</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Benefit from comprehensive career services and industry connections.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="bg-[#0092DD]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0092DD] transition-colors">
                <Star className="h-8 w-8 text-[#0092DD] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence Tradition</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Join a legacy of achievement spanning decades of educational excellence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


