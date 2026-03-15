
import React from 'react';
import Image from 'next/image';
// Fix: added Globe to the imports from lucide-react
import { CheckCircle, Clock, Calendar, Users, FileText, Search, MessageSquare, Play, Globe } from 'lucide-react';

const AdmissionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Penerimaan Siswa Baru</span>
            <span className="text-xs text-gray-400">04 / 08</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pendaftaran PPDB
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Bergabunglah dengan SMKN 1 Ciamis dan mulai perjalanan pendidikan yang akan membentuk masa depan Anda. 
              Proses penerimaan dirancang untuk mengidentifikasi calon siswa yang passionate dan siap berprestasi.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Begin Your Academic Journey</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Discover a transformative educational experience where innovation meets tradition. Our admissions process is designed to identify passionate learners ready to make their mark on the world.
            </p>
            <div className="flex gap-12">
              <div>
                <span className="block text-3xl font-bold text-[#0092DD]">89%</span>
                <span className="text-xs text-gray-400 uppercase font-bold">Acceptance Rate</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-[#0092DD]">$28K</span>
                <span className="text-xs text-gray-400 uppercase font-bold">Avg Financial Aid</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-[#0092DD]">15:1</span>
                <span className="text-xs text-gray-400 uppercase font-bold">Student-Faculty Ratio</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
             <Image
             src="/images/default-student.svg"
             alt="Students in classroom"
             width={800}
             height={450}
             className="rounded-2xl shadow-xl w-full"
             unoptimized={true}
           />
             <div className="absolute top-4 right-4 bg-[#0092DD] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center">
                <Users className="h-3 w-3 mr-2" /> Join 12,000+ Alumni
             </div>
          </div>
        </div>
      </section>

      {/* Application Process Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-gray-500 text-sm">Four simple steps to start your journey with us</p>
          </div>
          <div className="relative">
             <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { icon: <FileText />, title: "Submit Application", days: "2-3 days", desc: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ante ipsum primis." },
                  { icon: <Search />, title: "Document Review", days: "5-7 days", desc: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas." },
                  { icon: <MessageSquare />, title: "Assessment Interview", days: "1-2 weeks", desc: "Cras ultricies ligula sed magna dictum porta. Nulla porttitor accumsan tincidunt. Proin eget." },
                  { icon: <CheckCircle />, title: "Final Decision", days: "2-3 weeks", desc: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Curabitur arcu." }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    {/* Fix: casting icon element to any to allow className property in cloneElement */}
                    <div className="h-20 w-20 rounded-full bg-white border-2 border-[#0092DD] flex items-center justify-center text-[#0092DD] mb-6 shadow-md group-hover:bg-[#0092DD] group-hover:text-white transition-all">
                      {React.cloneElement(step.icon as React.ReactElement<any>, { className: "h-8 w-8" })}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3">{step.title}</h4>
                    <p className="text-[10px] text-gray-400 mb-4 leading-relaxed px-4">{step.desc}</p>
                    <span className="bg-[#0092DD]/10 text-[#0092DD] px-3 py-1 rounded-full text-[10px] font-bold">{step.days}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Requirements and Tuition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-8">Admission Requirements</h3>
            <ul className="space-y-6">
              {[
                { title: "Academic Transcripts", desc: "Official high school or college records" },
                { title: "Standardized Tests", desc: "SAT, ACT, or equivalent scores" },
                { title: "Personal Statement", desc: "500-800 word essay on your goals" },
                { title: "Recommendation Letters", desc: "Two letters from academic references" },
                { title: "Portfolio (if applicable)", desc: "For art, design, and creative programs" },
                { title: "Application Fee", desc: "$75 processing fee (waived for qualified students)" }
              ].map((req, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-maroon-600 mt-0.5 mr-4 shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm">{req.title}</h5>
                    <p className="text-xs text-gray-400">{req.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 p-6 bg-[#0092DD]/5 rounded-xl border-l-4 border-[#0092DD] flex items-start">
               <Globe className="h-5 w-5 text-[#0092DD] mr-4 mt-1" />
               <div>
                  <h5 className="font-bold text-sm mb-1">International Students</h5>
                  <p className="text-xs text-gray-500 leading-relaxed">Additional requirements include English proficiency scores (TOEFL/IELTS) and visa documentation.</p>
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8">Investment in Your Future</h3>
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
               <h4 className="font-bold mb-6 flex justify-between">Domestic Students <span className="text-xs font-normal text-gray-400 uppercase">Per Academic Year</span></h4>
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Undergraduate Tuition</span>
                    <span className="font-bold">$34,200</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Graduate Programs</span>
                    <span className="font-bold">$41,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room & Board</span>
                    <span className="font-bold">$14,500</span>
                  </div>
               </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
               <h4 className="font-bold mb-6 flex justify-between">International Students <span className="text-xs font-normal text-gray-400 uppercase">Per Academic Year</span></h4>
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Undergraduate Tuition</span>
                    <span className="font-bold">$44,700</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Graduate Programs</span>
                    <span className="font-bold">$52,300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room & Board</span>
                    <span className="font-bold">$14,500</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-[#0092DD]/5 rounded-2xl">
               <h5 className="font-bold mb-2">Financial Support Available</h5>
               <p className="text-xs text-gray-500 mb-4">Over 80% of students receive financial assistance through scholarships, grants, and work-study programs.</p>
               <button className="text-[#0092DD] font-bold text-xs hover:underline">Explore Financial Aid Options &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Dates & Deadlines</h2>
          <p className="text-sm text-gray-500">Stay on track with these important milestones for the upcoming academic year</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { date: "Oct 15", title: "Early Action", desc: "Non-binding early application deadline with priority consideration", tag: "Priority Deadline" },
             { date: "Jan 1", title: "Regular Decision", desc: "Standard application deadline for Fall semester admission", tag: "Final Deadline" },
             { date: "Feb 15", title: "Scholarship Applications", desc: "Complete FAFSA and scholarship applications for maximum aid", tag: "Financial Aid" },
             { date: "May 1", title: "Decision Day", desc: "Confirm enrollment and submit deposit to secure your place", tag: "Enrollment" }
           ].map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center border-t-4 border-[#0092DD]">
                <div className="bg-[#0092DD] text-white inline-block px-4 py-1 rounded-full text-xs font-bold mb-4">{item.date}</div>
                <h4 className="font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0092DD] opacity-60">{item.tag}</span>
             </div>
           ))}
        </div>
      </section>

      {/* Form and Map */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
           <div>
              <h3 className="text-2xl font-bold mb-4">Connect with Our Admissions Team</h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                Have questions about your application or need personalized guidance? Our dedicated admissions counselors are here to help you navigate the process.
              </p>
              <form className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name*" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                    <input type="email" placeholder="Email Address*" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="tel" placeholder="Phone Number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]" />
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]">
                       <option>Program Interest*</option>
                       <option>Undergraduate</option>
                       <option>Graduate</option>
                    </select>
                 </div>
                 <textarea placeholder="Tell us about your interests and goals..." rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#0092DD]"></textarea>
                 <button className="bg-[#0092DD] text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#0092DD] transition-all duration-300 transform hover:scale-105 shadow-lg">Send Inquiry</button>
              </form>
           </div>
           <div>
              <div className="relative rounded-2xl overflow-hidden h-100 shadow-xl group">
                 <img src="/images/default-campus.svg" className="w-full h-full object-cover" alt="Campus tour" />
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur text-gray-900 px-6 py-3 rounded-full font-bold flex items-center shadow-xl hover:bg-white transition-colors">
                       <Play className="h-5 w-5 mr-3 fill-[#0092DD] text-[#0092DD]" /> Virtual Campus Tour
                    </button>
                 </div>
              </div>
              <div className="mt-8">
                 <h4 className="font-bold text-lg mb-6">Experience Our Campus</h4>
                 <div className="space-y-6">
                    <div className="flex items-start">
                       <Calendar className="h-5 w-5 text-[#0092DD] mr-4 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold">In-Person Tours</p>
                          <p className="text-xs text-gray-400">Monday - Friday, 10 AM & 2 PM</p>
                       </div>
                    </div>
                    <div className="flex items-start">
                       <Play className="h-5 w-5 text-[#0092DD] mr-4 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold">Virtual Experience</p>
                          <p className="text-xs text-gray-400">Interactive online campus tours available 24/7</p>
                       </div>
                    </div>
                    <div className="flex items-start">
                       <Users className="h-5 w-5 text-[#0092DD] mr-4 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold">Information Sessions</p>
                          <p className="text-xs text-gray-400">Meet with admissions counselors and current students</p>
                       </div>
                    </div>
                 </div>
                 <button className="mt-10 border-2 border-gray-200 text-gray-900 px-8 py-3 rounded-lg font-bold hover:border-[#0092DD] hover:text-[#0092DD] transition-all">Schedule Your Visit</button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionsPage;


