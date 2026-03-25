
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Globe } from 'lucide-react';
import { z } from 'zod';
import { usePageHeader } from '@/lib/usePageHeader';
import { contactMessageCreateSchema } from '@/lib/validations';

type ContactInfoState = {
  address?: string
  phoneMain?: string
  phoneAlt?: string
  whatsappMain?: string
  whatsappAlt?: string
  emailMain?: string
  emailAlt?: string
  contactTitle?: string
  contactSubtitle?: string
  visibility?: {
    address?: boolean
    phone?: boolean
    whatsapp?: boolean
    email?: boolean
    social?: boolean
    hours?: boolean
  }
  socials?: { label: string; url: string }[]
  hours?: {
    weekday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
}

const ContactPage: React.FC = () => {
  const header = usePageHeader('contact')
  const [info, setInfo] = useState<ContactInfoState>({})
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formMessage, setFormMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({ visible: false, type: 'success', message: '' })
  const toastTimer = useRef<NodeJS.Timeout | null>(null)

  const contactFormSchema = contactMessageCreateSchema.extend({
    subject: z.string().min(1, 'Subjek wajib dipilih'),
    phone: z
      .string()
      .max(20, 'Nomor telepon terlalu panjang')
      .optional()
      .or(z.literal(''))
      .transform((val) => (val && val.trim().length > 0 ? val.trim() : undefined)),
  })

  useEffect(() => {
    let isMounted = true
    const fetchInfo = async () => {
      try {
  const res = await fetch('/api/settings', { cache: 'no-store' })
        const json = await res.json()
        if (!isMounted || !json?.success) return
        const map = (json.data as { settingKey: string; settingValue: string }[]).reduce<Record<string, string | undefined>>((acc, cur) => {
          acc[cur.settingKey] = cur.settingValue ?? undefined
          return acc
        }, {})

        const socials = Object.entries(map)
          .filter(([key, val]) => key.startsWith('social_') && val)
          .map(([key, val]) => ({
            label: key
              .replace(/^social_/, '')
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            url: val as string,
          }))
          .filter((s) => s.url)
          .sort((a, b) => a.label.localeCompare(b.label))
        

        setInfo({
          address: map['contact_address'],
          phoneMain: map['contact_phone_main'],
          phoneAlt: map['contact_phone_alt'],
          whatsappMain: map['contact_whatsapp_main'],
          whatsappAlt: map['contact_whatsapp_alt'],
          emailMain: map['contact_email_main'],
          emailAlt: map['contact_email_alt'],
          contactTitle: map['contact_info_title'],
          contactSubtitle: map['contact_info_subtitle'],
          visibility: {
            address: map['contact_show_address'] !== 'false',
            phone: map['contact_show_phone'] !== 'false',
            whatsapp: map['contact_show_whatsapp'] !== 'false',
            email: map['contact_show_email'] !== 'false',
            social: map['contact_show_social'] !== 'false',
            hours: map['contact_show_hours'] !== 'false',
          },
          socials,
          hours: {
            weekday: map['contact_hours_weekday'],
            friday: map['contact_hours_friday'],
            saturday: map['contact_hours_saturday'],
            sunday: map['contact_hours_sunday'],
          },
        })
      } catch (error) {
        console.error('Gagal memuat kontak', error)
      } finally {
        if (isMounted) setLoadingInfo(false)
      }
    }
    fetchInfo()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setFormStatus('idle')
    setFormMessage('')
    setFieldErrors({})

    const parsed = contactFormSchema.safeParse(form)
    if (!parsed.success) {
      const issues = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const key = issue.path[0]
        if (typeof key === 'string' && !acc[key]) acc[key] = issue.message
        return acc
      }, {})

      setFieldErrors(issues)
      setFormStatus('error')
      setFormMessage(Object.values(issues)[0] || 'Mohon lengkapi formulir dengan benar.')
      triggerToast('error', Object.values(issues)[0] || 'Mohon lengkapi formulir dengan benar.')
      setSending(false)
      return
    }

    const payload = { ...parsed.data, status: 'unread' as const }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setFormStatus('success')
        setFormMessage('Pesan terkirim. Terima kasih!')
        triggerToast('success', 'Pesan terkirim. Terima kasih!')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setFormStatus('error')
        setFormMessage(json.message || 'Gagal mengirim pesan')
        triggerToast('error', json.message || 'Gagal mengirim pesan')
      }
    } catch (error) {
      console.error(error)
      setFormStatus('error')
      setFormMessage('Terjadi kesalahan. Coba lagi nanti.')
      triggerToast('error', 'Terjadi kesalahan. Coba lagi nanti.')
    } finally {
      setSending(false)
    }
  }

  const triggerToast = (type: 'success' | 'error', message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ visible: true, type, message })
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 2500)
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  // Map embed uses alamat dari Info Kontak; fallback ke SMKN 1 Ciamis
  const mapQueryRaw = info.address?.trim() || 'SMKN 1 Ciamis'
  const mapQuery = encodeURIComponent(mapQueryRaw)
  // Using maps.google.com with zoom for better pin accuracy without API key
  const mapEmbedSrc = `https://maps.google.com/maps?hl=id&q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=B&output=embed`
  const mapLink = `https://maps.google.com/?q=${mapQuery}`


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background dengan gradien opacity dari atas ke bawah menggunakan warna primary */}
  <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>
        
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
            {header.loading ? (
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-white/20 rounded-lg animate-pulse" />
                <div className="h-4 w-2/3 bg-white/15 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
                  {header.displayTitle || header.title}
                </h1>
                {header.subtitle && (
                  <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                    {header.subtitle}
                  </p>
                )}
              </>
            )}
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

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {formStatus !== 'idle' && (
                    <div
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        formStatus === 'success'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {formMessage}
                    </div>
                  )}
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
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
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="" className="text-gray-400">Pilih subjek</option>
                        <option value="ppdb">Informasi PPDB</option>
                        <option value="umum">Informasi Umum</option>
                        <option value="akademik">Akademik</option>
                        <option value="fasilitas">Fasilitas</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                      {fieldErrors.subject && <p className="text-xs text-red-600 mt-1">{fieldErrors.subject}</p>}
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
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      required
                    />
                    {fieldErrors.message && <p className="text-xs text-red-600 mt-1">{fieldErrors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? 'Mengirim...' : 'Kirim Pesan'}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Hubungi kami kapan saja, kami siap membantu kebutuhan Anda.
                  </p>
                </div>

                {/* Address */}
                {info.visibility?.address !== false && (
                  <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Alamat</h3>
                      {loadingInfo ? (
                        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                      ) : (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {info.address || 'Belum ada data'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Phone */}
                {info.visibility?.phone !== false && (
                  <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Telepon</h3>
                      {loadingInfo ? (
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      ) : (
                        <>
                          {info.phoneMain && <p className="text-xs text-gray-600 mb-1">{info.phoneMain}</p>}
                          {info.phoneAlt && <p className="text-xs text-gray-600">{info.phoneAlt}</p>}
                          {!info.phoneMain && !info.phoneAlt && (
                            <p className="text-xs text-gray-500">Belum ada data</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {info.visibility?.whatsapp !== false && (
                  <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1.5">WhatsApp</h3>
                      {loadingInfo ? (
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      ) : (
                        <>
                          {info.whatsappMain && <p className="text-xs text-gray-600 mb-1">{info.whatsappMain}</p>}
                          {info.whatsappAlt && <p className="text-xs text-gray-600">{info.whatsappAlt}</p>}
                          {!info.whatsappMain && !info.whatsappAlt && (
                            <p className="text-xs text-gray-500">Belum ada data</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Email */}
                {info.visibility?.email !== false && (
                  <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Email</h3>
                      {loadingInfo ? (
                        <div className="space-y-2">
                          <div className="h-3 w-36 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      ) : (
                        <>
                          {info.emailMain && <p className="text-xs text-gray-600 mb-1">{info.emailMain}</p>}
                          {info.emailAlt && <p className="text-xs text-gray-600">{info.emailAlt}</p>}
                          {!info.emailMain && !info.emailAlt && (
                            <p className="text-xs text-gray-500">Belum ada data</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Media Sosial */}
                {info.visibility?.social !== false && (
                  <div className="flex items-start gap-3 pb-6 border-b border-blue-100">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Media Sosial</h3>
                      {loadingInfo ? (
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      ) : info.socials && info.socials.length > 0 ? (
                        <div className="space-y-1.5 text-xs text-gray-600">
                          {info.socials.map((s) => (
                            <a
                              key={s.label}
                              className="block hover:text-[#0268ab]"
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {s.label}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Belum ada data</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Office Hours */}
                {info.visibility?.hours !== false && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-[#0268ab]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#0268ab]" />
                    </div>
                    <div className="grow">
                      <h3 className="text-xs font-semibold text-gray-900 mb-3">Jam Pelayanan</h3>
                      {loadingInfo ? (
                        <div className="space-y-2">
                          {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Senin - Kamis</span>
                            <span className="font-medium text-gray-900">{info.hours?.weekday || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Jumat</span>
                            <span className="font-medium text-gray-900">{info.hours?.friday || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Sabtu</span>
                            <span className="font-medium text-gray-900">{info.hours?.saturday || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-gray-100">
                            <span className="text-gray-600">Minggu & Libur Nasional</span>
                            <span className="font-medium text-red-600">{info.hours?.sunday || 'Tutup'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              src={mapEmbedSrc}
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
              href={mapLink}
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


