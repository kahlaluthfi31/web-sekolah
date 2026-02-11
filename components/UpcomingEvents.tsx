
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  const events = [
    {
      month: "Feb",
      day: "15",
      category: "Academic",
      title: "Science Fair Exhibition",
      time: "09:00 AM - 03:00 PM",
      location: "Main Auditorium",
      color: "bg-blue-500"
    },
    {
      month: "Mar",
      day: "10",
      category: "Sports",
      title: "Annual Sports Day",
      time: "08:30 AM - 05:00 PM",
      location: "School Playground",
      color: "bg-green-500"
    },
    {
      month: "Apr",
      day: "22",
      category: "Arts",
      title: "Spring Music Concert",
      time: "06:30 PM - 08:30 PM",
      location: "Performing Arts Center",
      color: "bg-pink-500"
    },
    {
      month: "May",
      day: "08",
      category: "Community",
      title: "Parent-Teacher Conference",
      time: "01:00 PM - 07:00 PM",
      location: "Various Classrooms",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Agenda Mendatang</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Mark your calendar for these important dates and exciting activities coming soon.</p>
        </div>

        {/* <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#0092DD] outline-none">
                <option>All Months</option>
                <option>February</option>
                <option>March</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#0092DD] outline-none">
                <option>All Categories</option>
                <option>Academic</option>
                <option>Sports</option>
            </select>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md flex items-stretch hover:shadow-xl transition-shadow">
              <div className="bg-[#0092DD] text-white px-8 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">{event.month}</span>
                <span className="text-4xl font-black">{event.day}</span>
                <span className="text-xs mt-1">2025</span>
              </div>
              <div className="p-8 flex-grow">
                <div className="flex items-center mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${event.color}`}>
                    {event.category}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="h-3.5 w-3.5 mr-2" /> {event.time}
                  </div>
                  <div className="flex items-center text-gray-500 text-xs">
                    <MapPin className="h-3.5 w-3.5 mr-2" /> {event.location}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="bg-[#0092DD] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-[#0092DD] transition-all duration-300">
                    Learn More
                  </button>
                  <button className="text-gray-400 hover:text-[#0092DD] p-2 flex items-center text-xs font-bold">
                    <Calendar className="h-4 w-4 mr-1.5" /> Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-[#0092DD] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-white hover:text-[#0092DD] transition-all duration-300 transform hover:scale-105">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;


