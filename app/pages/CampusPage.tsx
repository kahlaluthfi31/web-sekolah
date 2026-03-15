import React, { useEffect, useRef } from "react";
import { Play, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

const CampusPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scrolling logic for the gallery
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const galleryImages = [
    {
      title: "Main Library",
      desc: "Digital resource center with 24/7 access",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Science Hub",
      desc: "Advanced laboratories for research",
      img: "https://media.istockphoto.com/id/1413606459/id/foto/penelitian-eksperimen-dan-uji-coba-medis-dilakukan-oleh-seorang-ilmuwan-di-laboratorium.jpg?s=1024x1024&w=is&k=20&c=54q8V24WhqErWTiBzNHLWh8OtYrTVLHYvkHBgLJcU2k=",
    },
    {
      title: "Recreation Center",
      desc: "Modern fitness facilities and wellness programs",
      img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Arts Complex",
      desc: "Studios and exhibition spaces for creatives",
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Student Lounge",
      desc: "Collaborative spaces for social interaction",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    },
    // Duplicate for infinite scroll
    {
      title: "Main Library",
      desc: "Digital resource center with 24/7 access",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Science Hub",
      desc: "Advanced laboratories for research",
      img: "https://media.istockphoto.com/id/1413606459/id/foto/penelitian-eksperimen-dan-uji-coba-medis-dilakukan-oleh-seorang-ilmuwan-di-laboratorium.jpg?s=1024x1024&w=is&k=20&c=54q8V24WhqErWTiBzNHLWh8OtYrTVLHYvkHBgLJcU2k=",
    },
    {
      title: "Recreation Center",
      desc: "Modern fitness facilities and wellness programs",
      img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sarana Prasarana</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Esse dolorum voluptatum ullam est sint nemo et est ipsa porro
            placeat quibusdam quia assumenda nunquam molestias.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span>{" "}
          <span className="mx-2">/</span> Sarana Prasarana
        </div>
      </div>


      {/* World-Class Facilities */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            World-Class Facilities
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Suspendisse potenti. Sed ut perspiciatis unde omnis iste natus error
            sit voluptatem accusantium doloremque laudantium.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Academic Excellence",
              items: [
                "State-of-the-art lecture halls",
                "Interactive learning labs",
                "Collaborative study spaces",
                "Research facilities",
              ],
              img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=500",
            },
            {
              title: "Sports & Wellness",
              items: [
                "Olympic-size swimming pool",
                "Multi-purpose gymnasium",
                "Wellness center",
                "Outdoor sports courts",
              ],
              img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500",
            },
            {
              title: "Student Life",
              items: [
                "Modern dormitories",
                "Student union building",
                "Dining commons",
                "Recreation centers",
              ],
              img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500",
            },
          ].map((facility, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-md group border border-gray-100"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={facility.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={facility.title}
                />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold mb-6">{facility.title}</h4>
                <ul className="space-y-3 mb-8">
                  {facility.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#0092DD] mr-3"></span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="text-[10px] font-bold uppercase text-[#0092DD] hover:underline">
                  Explore {facility.title.split(" ")[0]} Spaces &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Campus Virtual Tour */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-[40px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
            <img
              src="https://media.istockphoto.com/id/2197753729/id/foto/siswa-berjalan-dan-berbicara-bersama-di-malmo-swedia.jpg?s=1024x1024&w=is&k=20&c=fcKtVwgQMBoJ4Ff6JxVGN2lKkMxwNwylRqxdj0Gt9hM="
              className="w-full h-full object-cover"
              alt="Classroom"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold flex items-center shadow-xl">
                <Play className="h-4 w-4 mr-2 text-[#0092DD] fill-[#0092DD]" />{" "}
                360° Virtual Tour
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Experience Our Campus
            </h2>
            <p className="text-gray-500 mb-10 text-sm leading-relaxed">
              Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet
              non curabitur gravida arcu ac tortor dignissim convallis.
            </p>
            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <Play className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">Interactive walkthrough</p>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">Campus navigation</p>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">
                  Detailed facility information
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#0092DD] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#77C5F0] hover:text-[#0092DD] transition-colors shadow-lg">
                Start Virtual Tour
              </button>
              <button className="border-2 border-gray-200 text-gray-900 px-8 py-3 rounded-lg font-bold hover:border-[#0092DD] hover:text-[#0092DD] transition-all">
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Gallery */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Campus Life in Pictures
          </h2>
          <p className="text-sm text-gray-400">
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
            Vestibulum ac diam sit amet quam vehicula elementum.
          </p>
        </div>
        <div
          className="flex overflow-hidden whitespace-nowrap"
          ref={scrollRef}
          style={{ cursor: "grab" }}
        >
          <div className="flex">
            {galleryImages.map((item, i) => (
              <div key={i} className="inline-block px-4 w-[400px]">
                <div className="relative rounded-3xl overflow-hidden h-64 group cursor-pointer shadow-lg">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                  />
                  {/* Requested hover overlay from image 5 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h4 className="text-white font-bold text-xl mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/80 text-xs whitespace-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusPage;


