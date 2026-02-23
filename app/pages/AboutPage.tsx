import React from 'react';
import { Star, Award, Users, TrendingUp, Target, Heart, Lightbulb, CheckCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Profil Sekolah</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Mengenal lebih dekat SMK Negeri 1 Ciamis - Sejarah, Visi Misi, dan Keunggulan yang menjadikan kami pilihan terbaik untuk pendidikan vokasi berkualitas.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Beranda</span> <span className="mx-2">/</span> Profil Sekolah
        </div>
      </div>

      {/* Video Profile Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Video Profil</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mengenal SMK Negeri 1 Ciamis</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Tonton video profil kami untuk mengetahui lebih dalam tentang fasilitas, program keahlian, dan prestasi yang telah diraih.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/jWq8hHCOJkg?si=d1OGiF0YyHodW1PW"
                title="Video Profil SMK Negeri 1 Ciamis"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section - Horizontal Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Perjalanan Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sejarah SMK Negeri 1 Ciamis</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Perjalanan panjang kami dalam mencetak generasi unggul di bidang vokasi
            </p>
          </div>

          {/* Vertical Timeline with Center Line */}
          <div className="relative max-w-4xl mx-auto">
            {/* Center Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#0092DD]/30"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {[
                {
                  year: "1964",
                  title: "Berdirinya SMEA Negeri Ciamis",
                  description: "Didirikan sebagai sekolah vokasi pertama di Ciamis yang fokus pada bidang ekonomi dan administrasi.",
                  position: "left"
                },
                {
                  year: "1997",
                  title: "Perubahan Nama Menjadi SMK",
                  description: "Berubah nama menjadi SMK Negeri 1 Ciamis dengan penambahan program keahlian baru.",
                  position: "right"
                },
                {
                  year: "2010",
                  title: "Ekspansi Program Keahlian",
                  description: "Menambah program RPL, DKV, dan keahlian berbasis teknologi untuk era digital.",
                  position: "left"
                },
                {
                  year: "2020",
                  title: "Akreditasi A & Penghargaan",
                  description: "Meraih akreditasi A dan berbagai penghargaan sebagai SMK rujukan nasional.",
                  position: "right"
                },
                {
                  year: "2024",
                  title: "Era Digital & Kolaborasi Industri",
                  description: "Kurikulum industri 4.0 dan pembelajaran hybrid untuk masa depan.",
                  position: "left"
                }
              ].map((item, index) => (
                <div key={index} className={`relative flex items-center ${item.position === 'left' ? 'justify-start' : 'justify-end'}`}>
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0092DD] rounded-full border-2 border-white shadow z-10"></div>

                  {/* Connecting Line from Center to Card */}
                  <div className={`absolute left-1/2 top-2 w-8 h-0.5 bg-[#0092DD]/40 ${item.position === 'left' ? 'right-1/2' : 'left-1/2'}`}></div>

                  {/* Card */}
                  <div className={`w-5/12 ${item.position === 'right' ? 'ml-8' : 'mr-8'}`}>
                    <div className={`bg-white p-5 rounded-lg shadow-sm hover:shadow transition-all duration-300 border-l-4 ${item.position === 'left' ? 'border-[#0092DD]' : 'border-[#77C5F0]'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 ${item.position === 'left' ? 'bg-[#0092DD]' : 'bg-[#77C5F0]'} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                          {index + 1}
                        </div>
                        <span className="text-lg font-bold text-[#0092DD]">{item.year}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1.5">{item.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">60+</div>
              <div className="text-sm text-gray-500 font-medium">Tahun Pengalaman</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">15,000+</div>
              <div className="text-sm text-gray-500 font-medium">Alumni Sukses</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">8</div>
              <div className="text-sm text-gray-500 font-medium">Program Keahlian</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">A</div>
              <div className="text-sm text-gray-500 font-medium">Akreditasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Landasan Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visi & Misi</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Komitmen kami dalam mewujudkan pendidikan vokasi yang berkualitas dan berdaya saing global
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Visi Card */}
            <div className="group bg-white p-10 rounded-lg shadow border border-gray-100 hover:bg-[#0092DD] hover:border-[#0092DD] transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#77C5F0]/20 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-500">
                  <Target className="w-5 h-5 text-[#0092DD] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500">Visi</h3>
              </div>
              <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                Menjadi lembaga pendidikan vokasi yang unggul, terpercaya, dan berdaya saing global dalam mencetak lulusan yang kompeten, berakhlak mulia, dan siap menghadapi tantangan era industri 4.0 dengan tetap menjunjung tinggi nilai-nilai luhur bangsa Indonesia.
              </p>
            </div>

            {/* Misi Card */}
            <div className="group bg-white p-10 rounded-lg shadow border border-gray-100 hover:bg-[#0092DD] hover:border-[#0092DD] transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#77C5F0]/20 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-500">
                  <Heart className="w-5 h-5 text-[#0092DD] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500">Misi</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Menyelenggarakan pendidikan vokasi berkualitas dengan menerapkan kurikulum yang relevan dengan kebutuhan industri",
                  "Mengembangkan karakter siswa yang berintegritas, mandiri, dan berjiwa wirausaha",
                  "Memfasilitasi pembelajaran inovatif berbasis teknologi digital dan kolaborasi industri",
                  "Mempersiapkan lulusan yang profesional, adaptif, dan berdaya saing tinggi di pasar kerja global",
                  "Menjalin kemitraan strategis dengan dunia usaha dan industri untuk memperkuat link and match"
                ].map((misi, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-[#0092DD] group-hover:bg-white rounded-full flex items-center justify-center mt-0.5 transition-colors duration-500">
                      <span className="text-white group-hover:text-[#0092DD] text-xs font-bold transition-colors duration-500">{index + 1}</span>
                    </div>
                    <p className="text-gray-600 group-hover:text-white/90 text-sm leading-relaxed transition-colors duration-500">{misi}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-24 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Mengapa Memilih Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Keunggulan Sekolah</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Berbagai keunggulan yang menjadikan SMK Negeri 1 Ciamis pilihan terbaik untuk masa depan karir Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: "Akreditasi A",
                description: "Telah meraih akreditasi A dari BAN-S/M sebagai bukti kualitas pendidikan yang terjamin dan diakui secara nasional."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Tenaga Pengajar Profesional",
                description: "Didukung oleh guru-guru bersertifikat, berpengalaman, dan kompeten di bidangnya dengan metode pembelajaran yang modern."
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: "Fasilitas Modern",
                description: "Dilengkapi laboratorium, workshop, dan peralatan praktikum berstandar industri untuk mendukung pembelajaran berkualitas."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Kerjasama Industri",
                description: "Menjalin kemitraan dengan berbagai perusahaan terkemuka untuk program magang, sertifikasi, dan penyerapan lulusan."
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Prestasi Gemilang",
                description: "Siswa kami rutin meraih prestasi di tingkat kabupaten, provinsi, hingga nasional dalam berbagai kompetisi dan kejuaraan."
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Lulusan Terserap Kerja",
                description: "Tingkat keterserapan lulusan di dunia kerja mencapai 85% dalam 6 bulan pertama setelah kelulusan dengan gaji yang kompetitif."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#77C5F0]/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-[#0092DD]">{item.icon}</div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>

                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-linear-to-r from-[#0092DD] to-[#0077BB] p-12 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-4">Siap Bergabung Bersama Kami?</h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Jadilah bagian dari SMK Negeri 1 Ciamis dan wujudkan impian karirmu di dunia industri dengan pendidikan vokasi berkualitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#0092DD] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg">
                  Daftar Sekarang
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#0092DD] transition-all duration-300">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
