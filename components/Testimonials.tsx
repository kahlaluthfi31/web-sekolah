
import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Rachel Chen",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.",
      featured: false
    },
    {
      name: "Jessica Martinez",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit sed eiusmod tempor.",
      featured: true
    },
    {
      name: "David Rodriguez",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa.",
      featured: false
    }
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Alumni</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Hear what our current students and alumni have to say about their journey at MySchool.</p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#0092DD] transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                </div>
              </div>

              {/* Rating Stars */}
              {/* <div className="flex justify-center mb-6 space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div> */}

              {/* Testimonial Text */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed italic text-center">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              {/* Name & Role */}
              <div className="text-center border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-1">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>

              {/* Quote Icon */}
              <div className="flex justify-end mt-4">
                <div className="bg-gray-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="p-4 rounded-full bg-[#0092DD] text-white hover:bg-[#0077BB] transition-colors shadow-lg">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="p-4 rounded-full bg-[#0092DD] text-white hover:bg-[#0077BB] transition-colors shadow-lg">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


