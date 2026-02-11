'use client';

import React from 'react';
import { CheckCircle, Calendar, Users, FileText, Search, MessageSquare, Play, Globe } from 'lucide-react';

export default function AdmissionsPage() {
  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Admissions</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Begin your academic journey with us. Discover a transformative educational experience.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> Admissions
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Begin Your Academic Journey</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Discover a transformative educational experience where innovation meets tradition.
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
             <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-xl w-full" alt="Students in classroom" />
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-gray-500 text-sm">Four simple steps to start your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileText, title: "Submit Application", days: "2-3 days" },
              { icon: Search, title: "Document Review", days: "5-7 days" },
              { icon: MessageSquare, title: "Assessment Interview", days: "1-2 weeks" },
              { icon: CheckCircle, title: "Final Decision", days: "2-3 weeks" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white p-6 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-[#0092DD]/10 flex items-center justify-center text-[#0092DD] mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                <span className="text-xs text-[#0092DD] font-bold">{step.days}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-8">Admission Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Academic Transcripts",
              "Standardized Tests (SAT/ACT)",
              "Personal Statement",
              "Recommendation Letters",
              "Portfolio (if applicable)",
              "Application Fee $75"
            ].map((req, i) => (
              <div key={i} className="flex items-center bg-gray-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#0092DD] mr-3 flex-shrink-0" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


