import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Search, Filter } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      month: "Feb",
      day: "15",
      year: "2026",
      category: "Academic",
      title: "Science Fair Exhibition",
      description: "Annual science fair showcasing student innovations and research projects from all departments.",
      time: "09:00 AM - 03:00 PM",
      location: "Main Auditorium",
      organizer: "Science Department",
      participants: "120+ Students",
      color: "bg-blue-500",
    },
    {
      id: 2,
      month: "Mar",
      day: "10",
      year: "2026",
      category: "Sports",
      title: "Annual Sports Day",
      description: "School-wide sports competition featuring athletics, team sports, and traditional games.",
      time: "08:30 AM - 05:00 PM",
      location: "School Sports Ground",
      organizer: "Physical Education Dept",
      participants: "All Students",
      color: "bg-green-500",
    },
    {
      id: 3,
      month: "Apr",
      day: "22",
      year: "2026",
      category: "Arts",
      title: "Spring Music Concert",
      description: "Evening performance by school orchestra and choir featuring classical and modern music.",
      time: "06:30 PM - 08:30 PM",
      location: "Performing Arts Center",
      organizer: "Music Department",
      participants: "50+ Performers",
      color: "bg-pink-500",
    },
    {
      id: 4,
      month: "May",
      day: "08",
      year: "2026",
      category: "Community",
      title: "Parent-Teacher Conference",
      description: "Quarterly meeting to discuss student progress, academic performance, and development plans.",
      time: "01:00 PM - 07:00 PM",
      location: "Various Classrooms",
      organizer: "Administration",
      participants: "Parents & Teachers",
      color: "bg-orange-500",
    }
  ];

  const pastEvents = [
    {
      id: 5,
      month: "Jan",
      day: "20",
      year: "2026",
      category: "Academic",
      title: "New Year Academic Orientation",
      description: "Opening ceremony and orientation for the spring semester with keynote speeches.",
      time: "10:00 AM - 12:00 PM",
      location: "Main Hall",
      organizer: "Administration",
      participants: "All Students",
      color: "bg-purple-500",
      attendees: "850+ Participants",
      status: "Completed"
    },
    {
      id: 6,
      month: "Jan",
      day: "15",
      year: "2026",
      category: "Competition",
      title: "Inter-School Debate Championship",
      description: "Regional debate competition with teams from 10 different schools competing.",
      time: "09:00 AM - 04:00 PM",
      location: "Conference Hall",
      organizer: "Language Department",
      participants: "40 Debaters",
      color: "bg-indigo-500",
      attendees: "200+ Audience",
      status: "Completed"
    },
    {
      id: 7,
      month: "Dec",
      day: "18",
      year: "2025",
      category: "Cultural",
      title: "Winter Arts & Culture Festival",
      description: "Three-day festival celebrating art, music, dance, and cultural diversity.",
      time: "All Day Event",
      location: "School Campus",
      organizer: "Cultural Committee",
      participants: "Entire School",
      color: "bg-red-500",
      attendees: "1000+ Visitors",
      status: "Completed"
    },
    {
      id: 8,
      month: "Dec",
      day: "10",
      year: "2025",
      category: "Workshop",
      title: "Career Guidance Workshop",
      description: "Professional development workshop with industry experts and career counselors.",
      time: "02:00 PM - 05:00 PM",
      location: "Seminar Room B",
      organizer: "Career Counseling",
      participants: "Senior Students",
      color: "bg-teal-500",
      attendees: "150+ Students",
      status: "Completed"
    }
  ];

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-[#0092DD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Agenda & Events</h1>
          <p className="max-w-2xl mx-auto text-white/90 text-lg leading-relaxed">
            Explore our upcoming events and discover what's happening at our school. Join us in creating memorable experiences!
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD] cursor-pointer">Home</span> <span className="mx-2">/</span> Events
        </div>
      </div>

      {/* Tabs & Filters */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-[#0092DD] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-[#0092DD] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Past Events
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0092DD] outline-none"
                />
              </div>
              <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0092DD] outline-none">
                <option>All Categories</option>
                <option>Academic</option>
                <option>Sports</option>
                <option>Arts</option>
                <option>Community</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Banner */}
          <div className="mb-12 bg-white rounded-2xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <span className="block text-3xl font-bold text-[#0092DD] mb-2">
                {activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length}
              </span>
              <span className="text-sm text-gray-500 font-semibold">
                {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900 mb-2">12+</span>
              <span className="text-sm text-gray-500 font-semibold">Events This Year</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900 mb-2">5000+</span>
              <span className="text-sm text-gray-500 font-semibold">Total Participants</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900 mb-2">8</span>
              <span className="text-sm text-gray-500 font-semibold">Event Categories</span>
            </div>
          </div>

          {/* Events List */}   
          <div className="space-y-6">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Date Card */}
                  <div className="lg:col-span-1 bg-[#0092DD] text-white p-8 flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 right-4">
                      <span className={`${event.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {event.category}
                      </span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest opacity-80">{event.month}</span>
                    <span className="text-6xl font-black my-2">{event.day}</span>
                    <span className="text-sm opacity-80">{event.year}</span>
                  </div>

                  {/* Event Details */}
                  <div className="lg:col-span-2 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0092DD] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 text-[#0092DD] mr-3" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 text-[#0092DD] mr-3" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 text-[#0092DD] mr-3" />
                        <span className="text-sm">{event.organizer}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-[#0092DD] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">{event.participants}</span>
                      </div>
                    </div>

                    {activeTab === 'past' && 'attendees' in event && (
                      <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r">
                        <div className="flex items-center">
                          <span className="text-green-700 font-semibold text-sm mr-2">✓ {(event as unknown as { status: string }).status}</span>
                          <span className="text-gray-600 text-sm">• {(event as unknown as { attendees: string }).attendees}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {activeTab === 'upcoming' ? (
                        <>
                          <button className="text-[#0092DD] font-semibold text-sm flex items-center hover:gap-2 transition-all">
                            View Details <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all duration-300">
                            View Gallery
                          </button>
                          <button className="text-[#0092DD] font-semibold text-sm flex items-center hover:gap-2 transition-all">
                            Read Summary <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0092DD] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Organize an Event?</h2>
          <p className="text-white/90 mb-8 leading-relaxed">
            Have an idea for a school event? We'd love to hear from you! Submit your event proposal and join us in creating memorable experiences.
          </p>
          <button className="bg-white text-[#0092DD] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg">
            Submit Event Proposal
          </button>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
