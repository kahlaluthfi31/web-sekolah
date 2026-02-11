
import React from 'react';
// Added MessageSquare to the imports
import { MapPin, Phone, Clock, User, Mail, Smartphone, ChevronDown, MessageSquare } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Contact
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-12 rounded-[30px] shadow-sm border border-gray-100 text-center flex flex-col items-center group hover:shadow-xl transition-all duration-300">
                 <div className="bg-[#0092DD]/5 p-6 rounded-full text-[#0092DD] mb-6 group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <h4 className="font-bold text-xl mb-4">Our Address</h4>
                 <p className="text-xs text-gray-400 leading-relaxed">2847 Rainbow Road, Springfield, IL 62701, USA</p>
              </div>
              <div className="bg-white p-12 rounded-[30px] shadow-sm border border-gray-100 text-center flex flex-col items-center group hover:shadow-xl transition-all duration-300">
                 <div className="bg-[#0092DD]/5 p-6 rounded-full text-[#0092DD] mb-6 group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                    <Phone className="h-6 w-6" />
                 </div>
                 <h4 className="font-bold text-xl mb-4">Contact Number</h4>
                 <p className="text-xs text-gray-400 mb-1 leading-relaxed">Mobile: +1 (555) 123-4567</p>
                 <p className="text-xs text-gray-400 leading-relaxed">Email: info@example.com</p>
              </div>
              <div className="bg-white p-12 rounded-[30px] shadow-sm border border-gray-100 text-center flex flex-col items-center group hover:shadow-xl transition-all duration-300">
                 <div className="bg-[#0092DD]/5 p-6 rounded-full text-[#0092DD] mb-6 group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                    <Clock className="h-6 w-6" />
                 </div>
                 <h4 className="font-bold text-xl mb-4">Opening Hour</h4>
                 <p className="text-xs text-gray-400 mb-1 leading-relaxed">Monday - Saturday: 9:00 - 18:00</p>
                 <p className="text-xs text-gray-400 leading-relaxed">Sunday: Closed</p>
              </div>
           </div>

           <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-50 max-w-5xl mx-auto">
              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input type="text" placeholder="Your name*" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                    </div>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input type="email" placeholder="Email address*" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input type="tel" placeholder="Phone number*" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                    </div>
                    <div className="relative">
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                       <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-[#0092DD] appearance-none text-gray-400">
                          <option>Select service*</option>
                          <option>Admissions Inquiry</option>
                          <option>Alumni Support</option>
                          <option>General Information</option>
                       </select>
                    </div>
                 </div>
                 <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 h-4 w-4 text-gray-300" />
                    <textarea placeholder="Write a message*" rows={6} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-5 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]"></textarea>
                 </div>
                 <div className="text-center pt-6">
                    <button className="bg-[#0092DD] text-white px-12 py-4 rounded-xl font-bold shadow-lg hover:bg-[#77C5F0] hover:text-[#0092DD] transition-colors">Submit Message</button>
                 </div>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;


