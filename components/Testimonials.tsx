import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AlumniTestimonial {
  id: number;
  alumniName: string;
  graduationYear?: number | null;
  major?: string | null;
  currentOccupation?: string | null;
  company?: string | null;
  story?: string | null;
  status: string;
  photo?: string | null;
}

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allTestimonials, setAllTestimonials] = useState<AlumniTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchAlumniTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alumni?status=approved&limit=100');
        const result = await response.json();

        if (result.success) {
          // Filter alumni yang memiliki story (testimoni) dan status approved
          const testimonialsWithStory = result.data.filter((alumni: AlumniTestimonial) =>
            alumni.story && alumni.story.trim().length > 0 && alumni.status === 'approved'
          );

          setAllTestimonials(testimonialsWithStory);
        } else {
          setError('Gagal memuat data testimoni');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data');
        console.error('Error fetching alumni testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniTestimonials();
  }, []);

  const totalPages = Math.ceil(allTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestimonials = allTestimonials.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <section className="py-16 bg-[#f0f4f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Testimoni
          </span>
          <span className="text-xs text-gray-400">07 / 08</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-10">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {currentTestimonials.map((alumni) => (
              <div
                key={alumni.id}
                className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-[#0268ab] transition-all duration-300 ease-in-out shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 mb-4 shrink-0">
                  <Image
                    src={
                      alumni.photo ||
                      "https://media.istockphoto.com/vectors/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-vector-id1130884625?k=6&m=1130884625&s=170667a&w=0&h=b4ICEL-2imqnsT-m2tYGxZdxlgD1yKxmoDA-PmPc2-A="
                    }
                    alt={alumni.alumniName}
                    fill
                    sizes="80px"
                    className="object-cover"
                    loading="lazy"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://media.istockphoto.com/vectors/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-vector-id1130884625?k=6&m=1130884625&s=170667a&w=0&h=b4ICEL-2imqnsT-m2tYGxZdxlgD1yKxmoDA-PmPc2-A=";
                    }}
                  />
                </div>
                {/* Name & position */}
                <h4 className="text-sm font-bold text-gray-900">
                  {alumni.alumniName}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {alumni.currentOccupation || alumni.major || "Alumni"}
                </p>
                {alumni.company && (
                  <p className="text-xs text-gray-400">{alumni.company}</p>
                )}

                {/* Quote open */}
                <span className="text-3xl leading-none text-[#0268ab]/30 font-serif self-start mb-1">
                  &ldquo;
                </span>

                {/* Text */}
                <p className="text-sm text-gray-600 leading-relaxed flex-1 px-1">
                  {alumni.story}
                </p>

                {/* Quote close */}
                <span className="text-3xl leading-none text-[#0268ab]/30 font-serif self-end mt-1">
                  &rdquo;
                </span>

                {/* Graduation year */}
                {alumni.graduationYear && (
                  <p className="mt-3 text-[11px] text-gray-400">
                    Lulusan {alumni.graduationYear}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 transition-colors ${
              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0268ab]'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                num === currentPage
                  ? 'bg-[#0268ab] text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#0268ab]'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 transition-colors ${
              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0268ab]'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
