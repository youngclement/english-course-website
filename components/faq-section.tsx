"use client"

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@/components/ui/accordion"
import { TimelineContent } from "@/components/ui/timeline-animation"
import { Plus } from "lucide-react"
import { useRef } from "react"

type FAQItem = {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Khóa học này có phù hợp với người mới bắt đầu không?",
    answer:
      "Hoàn toàn phù hợp! Khóa học được thiết kế từ cơ bản đến nâng cao, phù hợp cho mọi đối tượng từ 18 tuổi trở lên. Thầy Huỳnh Chí Viễn sẽ hướng dẫn từng bước một cách dễ hiểu và thực tế.",
  },
  {
    question: "Tôi có thể áp dụng kiến thức này vào công việc được không?",
    answer:
      "Chắc chắn rồi! Kiến thức tâm lý học hành vi và xã hội có thể áp dụng trong nhiều lĩnh vực như quản lý nhân sự, bán hàng, giáo dục, tư vấn và các mối quan hệ công việc hằng ngày.",
  },
  {
    question: "Khóa học có cấp chứng chỉ hoàn thành không?",
    answer:
      "Có, học viên hoàn thành đầy đủ 48 buổi học và vượt qua bài kiểm tra cuối khóa sẽ được cấp chứng chỉ hoàn thành khóa học Tâm Lý Học Hành Vi & Xã Hội từ BHV English.",
  },
  {
    question: "Tôi có thể học online hay phải đến lớp trực tiếp?",
    answer:
      "Khóa học được tổ chức online qua nền tảng Zoom bằng tiếng Việt, giúp bạn học tập linh hoạt từ bất kỳ đâu. Mỗi buổi học kéo dài 1.5 giờ với sự tương tác trực tiếp cùng thầy giáo.",
  },
  {
    question: "Nếu tôi bỏ lỡ buổi học thì sao?",
    answer:
      "Đừng lo lắng! Tất cả các buổi học đều được ghi lại và học viên có thể xem lại video bài giảng. Ngoài ra, bạn có thể liên hệ với trung tâm để được hỗ trợ bổ sung kiến thức đã bỏ lỡ.",
  },
]

export default function FAQSection() {
  const faqsRef = useRef<HTMLDivElement>(null)
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  }

  return (
    <div className="p-10 mx-auto bg-white min-h-screen w-full shadow-sm grid md:grid-cols-12 gap-8" ref={faqsRef}>
      <div className="md:col-span-8 md:pr-16">
        <TimelineContent
          as="span"
          animationNum={0}
          timelineRef={faqsRef}
          customVariants={revealVariants}
          className="text-sm font-semibold text-[#004976]/60"
        >
          CÂU HỎI THƯỜNG GẶP
        </TimelineContent>

        <TimelineContent
          as="h2"
          animationNum={1}
          timelineRef={faqsRef}
          customVariants={revealVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-8"
        >
          Những Thắc Mắc Phổ Biến
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={faqsRef}
          customVariants={revealVariants}
          className="mt-6"
        >
          <Accordion defaultValue="item-0">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mb-0 rounded-none bg-transparent w-full">
                <AccordionHeader
                  customIcon
                  className="hover:no-underline p-0 border-t border-gray-200 py-4 relative data-[active]:bg-transparent hover:bg-gray-50 text-gray-700 data-[active]:text-[#004976] sm:text-base text-sm"
                >
                  <span className="font-medium lg:text-xl md:text-lg sm:text-base text-left">{item.question}</span>
                  <span className="relative group-data-[active]:rotate-45 border border-gray-400 text-gray-600 p-2 rounded-lg transition-all duration-300">
                    <Plus className="group-data-[active]:rotate-45 transition-all duration-300 w-4 h-4" />
                  </span>
                </AccordionHeader>
                <AccordionPanel
                  className="space-y-4 w-full mx-auto bg-white px-0"
                  articleClassName="pt-2 px-0 bg-white"
                >
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.answer}</p>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </TimelineContent>
      </div>

      <div className="md:col-span-4 w-full">
        <div className="flex flex-col space-y-6 md:w-80 ml-auto">
          <TimelineContent
            as="div"
            animationNum={8}
            timelineRef={faqsRef}
            customVariants={revealVariants}
            className="space-y-3"
          >
            <span className="text-sm font-semibold text-[#004976]/60">HỖ TRỢ HỌC VIÊN</span>
            <h3 className="text-xl font-bold text-gray-900">Cần Hỗ Trợ Thêm?</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Đội ngũ tư vấn của BHV English luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ với chúng tôi qua hotline hoặc email
              để được giải đáp mọi thắc mắc về khóa học.
            </p>
            <div className="pt-4">
              <button className="bg-[#004976] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004976]/90 transition-colors">
                Liên Hệ Ngay
              </button>
            </div>
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={9}
            timelineRef={faqsRef}
            customVariants={revealVariants}
            className="space-y-3 pt-8"
          >
            <span className="text-sm font-semibold text-[#004976]/60">CAM KẾT CHẤT LƯỢNG</span>
            <h3 className="text-xl font-bold text-gray-900">Đảm Bảo Hiệu Quả</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Chúng tôi cam kết mang đến chất lượng giảng dạy tốt nhất với phương pháp khoa học, thực tế và dễ áp dụng
              vào cuộc sống hằng ngày.
            </p>
          </TimelineContent>
        </div>
      </div>
    </div>
  )
}
