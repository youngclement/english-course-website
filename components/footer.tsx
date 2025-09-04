import { Phone, MapPin, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="bg-[#074165] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-32 py-12 md:py-16">
          {/* Grid 2 cột + line ngăn cách */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left Column */}
            <div className="h-full flex flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3485833875343879611-Photoroom-yUaITJGQbIFqU7R8lJsZZPdF860zM8.png"
                  alt="BHV English Logo"
                  className="w-24 md:w-28 object-contain"
                />
                <div className="text-center md:text-left">
                  <p className="text-white/95 text-sm md:text-base font-medium leading-relaxed">
                    BHV English với phương châm <span className="italic">"Bringing Home the Values"</span> mang đến cho học viên cách tiếp cận tiếng Anh
                    hoàn toàn mới và hiệu quả với tiêu chí đào tạo tư duy và giáo dục khai phóng.
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 md:mt-8">
                <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs md:text-sm font-semibold justify-center md:justify-start">
                  <a href="#" className="text-white/90 hover:text-white">Đăng ký học</a>
                  <a href="#" className="text-white/90 hover:text-white">Cảm nhận học viên</a>
                  <a href="#" className="text-white/90 hover:text-white">Lịch khai giảng</a>
                  <a href="#" className="text-white/90 hover:text-white">Liên hệ</a>
                </nav>
              </div>

              {/* Socials */}
              <div className="mt-5 flex justify-center md:justify-start space-x-4">
                <a href="https://www.facebook.com/bhvenglish" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://bhvenglish.vn" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/@bhvenglish4475" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column với border-left */}
            <div className="space-y-8 pl-8 md:pl-12 border-l border-white/30">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm md:text-base mb-1">Hotline</h4>
                    <p className="text-white/95 text-xs md:text-sm font-medium leading-relaxed">
                      0933.60.90.30<br />093.94.808.94
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm md:text-base mb-1">Giờ làm việc</h4>
                    <p className="text-white/95 text-xs md:text-sm font-medium leading-relaxed">
                      🕐 8:30 – 21:30 (UTC+7)<br />📧 bhvenglish@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm md:text-base mb-1">Địa chỉ</h4>
                  <p className="text-white/95 text-xs md:text-sm font-medium leading-relaxed">
                    Số 01 Cô Bắc, Phường Cầu Kiệu, TP.HCM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#004976] text-white py-4">
        <div className="container mx-auto px-6 md:px-10 lg:px-28 text-center">
          <p className="text-white/90 text-[11px] md:text-xs font-medium">
            Copyright @ 2021 - 2022 BHV English
          </p>
        </div>
      </div>
    </footer>
  )
}
