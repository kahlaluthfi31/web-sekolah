
import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force play video
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });

      // Ensure video loops
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
    }
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload"
      >
        <source src="https://videos.pexels.com/video-files/5200358/5200358-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/5200358/5200358-hd_1920_1080_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50 z-1"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
          SMK NEGERI 1 CIAMIS
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join a community of scholars, researchers, and creators dedicated to pushing the boundaries of knowledge and preparing for a global future.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-6 py-3 bg-[#0268ab] text-white rounded-full font-semibold text-base hover:bg-white hover:text-[#0268ab] transition-all duration-300 transform hover:scale-105 shadow-lg">
            Apply Now
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-base hover:bg-white hover:text-[#0268ab] transition-all duration-300 transform hover:scale-105">
            School Tour
          </button>
        </div>

        {/* Announcement Badge */}
        <div className="mt-12 inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <span className="bg-[#0268ab] text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded">New</span>
          <span className="text-white text-sm font-medium">Fall 2025 Applications Open - Early Decision Deadline December 15</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;


