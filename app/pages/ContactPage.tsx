
import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background dengan gradien opacity dari atas ke bawah menggunakan warna primary */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }} />
        </div>
        
        {/* School-related floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        {/* Contact-related illustrations */}
        <div className="absolute top-20 left-10 text-white/10">
          <Mail className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <Phone className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <MapPin className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Clock className="w-10 h-10" strokeWidth={1} />
        </div>
        
        {/* School elements */}
        <div className="absolute bottom-32 right-20 text-white/8">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L23 9L12 3Z" />
            <path d="M12 15L12 21" />
            <path d="M8 17L8 21" />
            <path d="M16 17L16 21" />
            <path d="M1 9L1 21L23 21L23 9" />
          </svg>
        </div>
        <div className="absolute top-40 left-40 text-white/8">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 5V19H5V5H19Z" />
            <path d="M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM12 15C14.67 15 17 16.17 17 17.5V19H7V17.5C7 16.17 9.33 15 12 15Z" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Mari Terhubung dengan 
              <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">Kami</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
              Kami siap membantu Anda dengan pertanyaan, informasi pendaftaran, atau kebutuhan lainnya. 
              Hubungi kami melalui formulir atau informasi kontak yang tersedia.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info Cards */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Kirim Pesan</h2>
                  <p className="text-gray-500 text-sm">
                    Isi formulir di bawah ini dan kami akan segera merespons
                  </p>
                </div>

                <form className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                        <option value="" className="text-gray-400">Pilih subjek</option>
                        <option value="ppdb">Informasi PPDB</option>
                        <option value="umum">Informasi Umum</option>
                        <option value="akademik">Akademik</option>
                        <option value="fasilitas">Fasilitas</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tulis pesan Anda di sini..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] hover:shadow-lg transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                      Kirim Pesan
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar - 1 column */}
            <div className="lg:col-span-1">
              {/* Unified Contact Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 space-y-6">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Informasi Kontak</h2>
                  <p className="text-xs text-gray-500 mt-1">Hubungi kami kapan saja</p>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                  <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#0268ab]" />
                  </div>
                  <div className="grow">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Alamat</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Jl. Pending No. 93, Kecamatan Ciamis, Kabupaten Ciamis, Jawa Barat 46211
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                  <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#0268ab]" />
                  </div>
                  <div className="grow">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Telepon</h3>
                    <p className="text-xs text-gray-600 mb-1">(0265) 771234</p>
                    <p className="text-xs text-gray-600">+62 812-3456-7890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                  <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#0268ab]" />
                  </div>
                  <div className="grow">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Email</h3>
                    <p className="text-xs text-gray-600 mb-1">info@smkn1ciamis.sch.id</p>
                    <p className="text-xs text-gray-600">admin@smkn1ciamis.sch.id</p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#0268ab]" />
                  </div>
                  <div className="grow">
                    <h3 className="text-xs font-semibold text-gray-900 mb-3">Jam Pelayanan</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Senin - Kamis</span>
                        <span className="font-medium text-gray-900">07:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Jumat</span>
                        <span className="font-medium text-gray-900">07:00 - 11:30</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Sabtu</span>
                        <span className="font-medium text-gray-900">07:00 - 13:00</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-gray-100">
                        <span className="text-gray-600">Minggu & Libur</span>
                        <span className="font-medium text-red-600">Tutup</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Lokasi Kami</h2>
            <p className="text-gray-600 text-sm">
              Kunjungi sekolah kami untuk informasi lebih lanjut
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.8!2d108.3522!3d-7.3264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f50d10b5c3b8f%3A0x5a7c7e8f9d0e1f2a!2sSMKN%201%20Ciamis!5e0!3m2!1sid!2sid!4v1709856000000!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
          
          {/* Quick Direction Button */}
          <div className="text-center mt-8">
            <a
              href="https://maps.google.com/?q=SMKN+1+Ciamis+Jawa+Barat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              Buka di Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;


