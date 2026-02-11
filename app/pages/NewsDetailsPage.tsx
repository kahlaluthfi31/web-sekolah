
import React from 'react';
import { MessageSquare, Calendar, Clock, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

const NewsDetailsPage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">News Details</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> News Details
        </div>
      </div>

      <article className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px] mb-12">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Main Article" />
           </div>

           <div className="flex items-center gap-6 mb-8">
              <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-widest"><Clock className="h-4 w-4 mr-2 text-[#0092DD]" /> 8 min read</span>
              <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-widest">Technology</span>
           </div>

           <h1 className="text-4xl font-black text-gray-900 mb-8 leading-tight">The Future of Artificial Intelligence: Transforming Industries and Reshaping Society</h1>

           <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-12">
              <div className="flex items-center">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full object-cover mr-4" alt="Author" />
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

              <div className="rounded-3xl overflow-hidden shadow-xl h-[400px] mb-4">
                 <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="AI Workspace" />
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
                 <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-lg h-64 object-cover" alt="Context 1" />
                 <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-lg h-64 object-cover" alt="Context 2" />
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


