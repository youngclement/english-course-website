"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, ZoomIn, X } from "lucide-react"

export default function InstructorSection() {
  const [showMedia, setShowMedia] = useState(false)
  const [showInstructorInfo, setShowInstructorInfo] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const mediaArticles = [
    {
      title: "Cha mẹ Mỹ dạy con có khéo 'như lời đồn'? Thầy giáo ở TP.HCM tiết lộ cực thú vị",
      source: "aFamily",
      url: "https://afamily.vn/cha-me-my-day-con-co-kheo-nhu-loi-don-thay-giao-o-tphcm-co-tiet-lo-cuc-thu-vi-20220717224440807.chn",
    },
    {
      title: "Cha mẹ giỡn chuyện dung tục thì được, con hỏi về tình dục thì né tránh",
      source: "Báo Thanh Niên",
      url: "https://thanhnien.vn/cha-me-gion-chuyen-dung-tuc-thi-duoc-con-hoi-ve-tinh-duc-thi-ne-tranh-1851539876.htm",
    },
    {
      title:
        "Làm cha làm mẹ - Nội lực bình an cho con - Cuốn sách khiến bạn thảng thốt nhận ra: Liệu mình có đang yêu thương con sai cách?",
      source: "aFamily",
      url: "https://afamily.vn/lam-cha-lam-me-noi-luc-binh-an-cho-con-cuon-sach-khien-ban-thang-thot-nhan-ra-lieu-minh-co-dang-yeu-thuong-con-sai-cach-20230119205916507.chn",
    },
    {
      title:
        "Những đứa trẻ được nuôi lớn bằng sự SỢ HÃI: Lúc nhỏ được tiếng CON NGOAN nhưng lớn lên lòng tự tôn khiếm khuyết",
      source: "aFamily",
      url: "https://afamily.vn/duoc-hoi-con-o-nha-so-ba-hay-so-me-hon-thay-giao-o-sai-gon-co-cach-tra-loi-thau-tinh-dat-ly-ngay-lap-tuc-nhan-ve-bao-like-20211203204423738.chn",
    },
    {
      title:
        "Không đánh mắng, không chì chiết, đây là cách xử lý được ông bố ở Sài Gòn gợi ý khi phát hiện con xem phim 'đen'",
      source: "aFamily",
      url: "https://afamily.vn/khong-danh-mang-khong-chi-chiet-day-la-cach-xu-ly-cua-ong-bo-o-sai-gon-khi-con-xem-phim-den-cha-me-doc-xong-lay-giay-but-ra-ghi-voi-20211215212045961.chn",
    },
  ]

  const handleToggleMedia = () => {
    if (showMedia) {
      // Khi thu gọn phần truyền thông, hiện lại phần thông tin về thầy Viễn
      setShowMedia(false)
      setTimeout(() => {
        setShowInstructorInfo(true)
      }, 150) // Delay nhỏ để tránh giật UI
    } else {
      // Khi mở phần truyền thông, đóng phần thông tin về thầy Viễn
      setShowInstructorInfo(false)
      setTimeout(() => {
        setShowMedia(true)
      }, 150) // Delay nhỏ để tránh giật UI
    }
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left - Image Gallery */}
          <div className="relative order-2 lg:order-1">
            {/* Main Image */}
            <div className="relative w-full max-w-sm md:max-w-md mx-auto">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Th%C3%A2%CC%80y%20Huy%CC%80nh%20Chi%CC%81%20Vi%C3%AA%CC%83n%20G%E1%BB%91c.jpg-b5c2p63DZ3BIeBIfVU8SgsEpnqPWjz.jpeg"
                alt="Thầy Huỳnh Chí Viễn"
                width={400}
                height={400}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-square"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-[#004976] text-white p-3 md:p-4 rounded-xl shadow-lg">
                <div className="text-xl md:text-2xl font-bold">10+</div>
                <div className="text-xs md:text-sm">Năm kinh nghiệm</div>
              </div>
            </div>

            {/* Additional Images Gallery */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-sm md:max-w-md mx-auto mt-4">
              <div className="relative aspect-square group overflow-hidden rounded-lg">
                <Image
                  src="/vienbook-tuoitredungdelamgi.jpg"
                  alt="Sách Tuổi Trẻ Dùng Để Làm Gì - Thầy Huỳnh Chí Viễn"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover w-full h-full shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => openImageModal("/vienbook-tuoitredungdelamgi.jpg")}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg"
                    aria-label="Phóng to hình ảnh"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
              <div className="relative aspect-square group overflow-hidden rounded-lg">
                <Image
                  src="/vienbook-thebeatles.jpg"
                  alt="Sách The Beatles Như Thế Kỷ Một Huyền Thoại - Thầy Huỳnh Chí Viễn"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover w-full h-full shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => openImageModal("/vienbook-thebeatles.jpg")}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg"
                    aria-label="Phóng to hình ảnh"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
              <div className="relative aspect-square group overflow-hidden rounded-lg">
                <Image
                  src="/vienbook-comotnuocmyratkhac.jpg"
                  alt="Sách Có Một Nước Mỹ Rất Khác - Thầy Huỳnh Chí Viễn"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover w-full h-full shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => openImageModal("/vienbook-comotnuocmyratkhac.jpg")}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg"
                    aria-label="Phóng to hình ảnh"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
              <div className="relative aspect-square group overflow-hidden rounded-lg">
                <Image
                  src="/vienbook-lamchamenolucbinhanchocon.jpg"
                  alt="Sách Làm Cha Làm Mẹ Nội Lực Bình An Cho Con - Thầy Huỳnh Chí Viễn"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover w-full h-full shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => openImageModal("/vienbook-lamchamenolucbinhanchocon.jpg")}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg"
                    aria-label="Phóng to hình ảnh"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                Đôi Nét Về Thầy Huỳnh Chí Viễn
              </h2>
              <div className="w-16 md:w-20 h-1 bg-[#004976] rounded-full"></div>
            </div>

            {showInstructorInfo && (
              <div className="space-y-3 md:space-y-4 text-gray-600 leading-relaxed text-sm md:text-base animate-in slide-in-from-top-2 duration-300">
                <p>
                  Thầy Huỳnh Chí Viễn (Barry) là chuyên gia tâm lý học hành vi và xã hội gần 19 năm kinh nghiệm trong lĩnh vực giảng dạy. Thầy tốt nghiệp ngành sư phạm tiếng Anh, quản lý giáo dục và tâm lý hành vi tại đại học Nicholls State University, bang Louisiana, Hoa Kỳ năm 2006.
                </p>

                <p>
                  Với phương pháp giảng dạy độc đáo, thầy Viễn đã giúp hàng trăm học viên hiểu rõ hơn về bản thân, cải thiện các mối quan hệ và áp dụng kiến thức tâm lý học vào cuộc sống hàng ngày một cách hiệu quả. Thầy từng đạt giải "Tâm Huyết Giáo Dục" 3 năm liền (2009, 2010, 2011) và có kinh nghiệm giảng dạy tại nhiều trường đại học danh tiếng.
                </p>


              </div>
            )}

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  Truyền thông uy tín nói gì về Thầy Viễn?
                </h3>
                <button
                  onClick={handleToggleMedia}
                  className="flex items-center gap-2 text-[#004976] hover:text-[#003a66] transition-colors"
                >
                  <span className="text-sm font-medium">{showMedia ? "Thu gọn" : "Xem thêm"}</span>
                  {showMedia ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                Không chỉ được học viên và phụ huynh tin tưởng, Thầy Viễn còn thường xuyên được các nhà báo, trang tin
                lớn tìm đến để chia sẻ những góc nhìn sâu sắc về tâm lý và giáo dục.
              </p>

              <div className="space-y-3 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-3">📌 Tiêu biểu:</div>
                <div className="border-l-4 border-[#004976] pl-4 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-[#004976] font-medium mb-1">📩 aFamily</div>
                      <h4 className="text-sm md:text-base font-medium text-gray-900 leading-snug mb-2">
                        Cha mẹ Mỹ dạy con có khéo 'như lời đồn'? Thầy giáo ở TP.HCM tiết lộ cực thú vị
                      </h4>
                    </div>
                    <a
                      href="https://afamily.vn/cha-me-my-day-con-co-kheo-nhu-loi-don-thay-giao-o-tphcm-co-tiet-lo-cuc-thu-vi-20220717224440807.chn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 text-[#004976] hover:text-[#003a66] hover:bg-gray-50 transition-colors"
                      title="Xem chi tiết"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${showMedia ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="space-y-3">
                  {mediaArticles.slice(1).map((article, index) => (
                    <div key={index} className="border-l-4 border-[#004976] pl-4 py-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-[#004976] font-medium mb-1">📩 {article.source}</div>
                          <h4 className="text-sm md:text-base font-medium text-gray-900 leading-snug mb-2">
                            {article.title}
                          </h4>
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 text-[#004976] hover:text-[#003a66] hover:bg-gray-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-600 italic mt-4 pt-3 border-t border-gray-200">
                    Điều này khẳng định những chia sẻ của Thầy không chỉ hữu ích trong lớp học mà còn được xã hội, báo
                    chí quan tâm và lan tỏa rộng rãi.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
              <Button
                size="lg"
                className="bg-[#004976] hover:bg-[#003a66] text-white px-6 md:px-8 text-sm md:text-base"
                onClick={() => window.open('https://bhvenglish.vn/giao-vien-bhv/', '_blank')}
              >
                Tìm Hiểu Thêm
              </Button>

            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
              aria-label="Đóng"
            >
              <X size={32} />
            </button>
            <Image
              src={selectedImage}
              alt="Phóng to hình ảnh"
              width={600}
              height={600}
              className="w-full h-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  )
}
