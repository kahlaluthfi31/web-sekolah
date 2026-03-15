
import React from 'react';
import { MessageSquare, Calendar, Clock, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

const NewsDetailsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Breadcrumb */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="hover:text-maroon-600 cursor-pointer">Beranda</span>
            <span>/</span>
            <span className="hover:text-maroon-600 cursor-pointer">Berita</span>
            <span>/</span>
            <span className="text-gray-900">Detail</span>
          </div>
        </div>
      </section>

      <article className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="rounded-2xl overflow-hidden shadow-lg h-125 mb-12">
              <img src="/images/default-news.svg" className="w-full h-full object-cover" alt="Main Article" />
           </div>

           <div className="flex items-center gap-6 mb-8">
              <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-widest"><Clock className="h-4 w-4 mr-2 text-[#0092DD]" /> 8 min read</span>
              <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-widest">Technology</span>
           </div>

           <h1 className="text-4xl font-black text-gray-900 mb-8 leading-tight">The Future of Artificial Intelligence: Transforming Industries and Reshaping Society</h1>

           <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-12">
              <div className="flex items-center">
                 <img src="/images/default-faculty.svg" className="w-12 h-12 rounded-full object-cover mr-4" alt="Author" />
                 <div>
                    <h5 className="font-bold text-gray-900">Sarah Anderson</h5>
                    <div className="flex items-center text-[10px] text-gray-400 font-bold gap-4 uppercase">
                       <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Feb 13, 2025</span>
                       <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" /> 24 Comments</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-4 text-gray-300">
                 <Twitter className="h-5 w-5 cursor-pointer hover:text-[#0092DD] transition-colors" />
                 <Facebook className="h-5 w-5 cursor-pointer hover:text-[#0092DD] transition-colors" />
                 <Linkedin className="h-5 w-5 cursor-pointer hover:text-[#0092DD] transition-colors" />
              </div>
           </div>

           <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-900 mb-8">Artificial Intelligence has emerged as one of the most transformative technologies of our time, revolutionizing industries from healthcare to finance, and fundamentally changing how we live and work.</p>
              <p className="mb-8">In recent years, the advancement of AI technologies has accelerated at an unprecedented pace, bringing both exciting opportunities and unique challenges. This comprehensive analysis explores the current state of AI, its impact across various sectors, and what the future might hold for this revolutionary technology.</p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Current State of AI Technology</h2>
              <p className="mb-8">Modern AI systems have achieved remarkable capabilities in areas such as:</p>
              <ul className="list-disc pl-6 mb-12 space-y-2">
                 <li>Natural Language Processing and Generation</li>
                 <li>Computer Vision and Image Recognition</li>
                 <li>Predictive Analytics and Decision Making</li>
                 <li>Autonomous Systems and Robotics</li>
              </ul>

              <div className="rounded-2xl overflow-hidden shadow-lg h-100 mb-4">
                 <img src="/images/default-news.svg" className="w-full h-full object-cover" alt="AI Workspace" />
              </div>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-16">AI systems processing and analyzing complex data patterns</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Transforming Industries</h2>
              <p className="mb-12">From healthcare diagnostics to financial forecasting, AI is revolutionizing traditional business models and creating new opportunities for innovation and efficiency. Organizations worldwide are leveraging AI to streamline operations, enhance customer experiences, and drive growth.</p>

              <div className="bg-[#0092DD]/5 p-12 rounded-[40px] border-l-8 border-[#0092DD] mb-16 italic text-xl font-bold text-gray-900 leading-tight">
                 "Artificial Intelligence is not just another technological advancement; it's a fundamental shift in how we approach problem-solving and decision-making across every industry and sector of society."
                 <p className="text-sm font-bold mt-4 not-italic text-[#0092DD] uppercase tracking-widest">— Dr. Rachel Chen, AI Research Director</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ethical Considerations and Future Challenges</h2>
              <p className="mb-12">As AI continues to evolve, important questions arise about privacy, security, and the ethical implications of increasingly autonomous systems. Addressing these challenges while fostering innovation will be crucial for the sustainable development of AI technologies.</p>

              <div className="grid grid-cols-2 gap-8 mb-16">
                 <img src="/images/default-news.svg" className="rounded-3xl shadow-lg h-64 object-cover" alt="Context 1" />
                 <img src="/images/default-news.svg" className="rounded-3xl shadow-lg h-64 object-cover" alt="Context 2" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Looking Ahead</h2>
              <p className="mb-12">The future of AI promises even more groundbreaking developments, from advanced cognitive systems to seamless human-AI collaboration. As we move forward, the key will be balancing technological progress with ethical considerations and societal impact.</p>
           </div>

           <div className="pt-12 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                 {["Artificial Intelligence", "Technology", "Innovation", "Future"].map(tag => (
                   <span key={tag} className="bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">{tag}</span>
                 ))}
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Share:</span>
                 <div className="flex gap-2">
                    <Twitter className="h-4 w-4 text-gray-400 hover:text-[#0092DD] cursor-pointer" />
                    <Facebook className="h-4 w-4 text-gray-400 hover:text-[#0092DD] cursor-pointer" />
                    <Linkedin className="h-4 w-4 text-gray-400 hover:text-[#0092DD] cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailsPage;


