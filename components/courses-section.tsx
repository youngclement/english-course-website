import { Timeline } from "@/components/ui/timeline"

export default function CoursesSection() {
  const timelineData = [
    {
      title: "Phần 1",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Nhập Môn Tâm Lý Học Hành Vi & Xã Hội
          </h3>
          <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mb-4">
            <p className="mb-2 font-medium">Học viên sẽ:</p>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Hiểu rõ các khái niệm nền tảng trong tâm lý học hành vi và xã hội</li>
              <li>Khám phá các yếu tố quyết định hành vi con người (nhu cầu, bản năng, tiềm thức, định kiến...)</li>
              <li>Nhận diện những dạng rối loạn tâm lý phổ biến và cách tiếp cận chúng một cách nhân văn</li>
            </ul>
          </div>
          <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">6 chuyên đề • 18 giờ học</div>
        </div>
      ),
    },
    {
      title: "Phần 2",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Chìa Khóa Của Thành Công & Hạnh Phúc
          </h3>
          <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mb-4">
            <p className="mb-2 font-medium">Học viên sẽ:</p>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Nắm rõ vai trò của EQ và IQ trong thành công cá nhân</li>
              <li>Xây dựng tư duy tích cực, phát triển thói quen tư duy hiệu quả</li>
              <li>Học cách tranh luận có văn hóa, phát triển khả năng tư duy độc lập và ứng xử văn minh</li>
            </ul>
          </div>
          <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">6 chuyên đề • 18 giờ học</div>
        </div>
      ),
    },
    {
      title: "Phần 3",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Yêu Đúng Cách, Cưới Đúng Người
          </h3>
          <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mb-4">
            <p className="mb-2 font-medium">Học viên sẽ:</p>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Thấu hiểu tâm lý giới tính trong tình yêu và hôn nhân</li>
              <li>Biết cách xây dựng và duy trì các mối quan hệ bền vững</li>
              <li>Học cách chia tay văn minh và vượt qua tổn thương một cách trưởng thành</li>
            </ul>
          </div>
          <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">6 chuyên đề • 18 giờ học</div>
        </div>
      ),
    },
    {
      title: "Phần 4",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Nuôi Dạy Con Như Một Chuyên Gia Tâm Lý
          </h3>
          <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mb-4">
            <p className="mb-2 font-medium">Học viên sẽ:</p>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Hiểu rõ sự ảnh hưởng của cha mẹ đến nhân cách con cái</li>
              <li>Nắm được sự khác biệt trong quan điểm nuôi dạy giữa các nền văn hóa</li>
              <li>Ứng dụng kiến thức tâm lý trong kết nối và đồng hành cùng con tuổi teen</li>
            </ul>
          </div>
          <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">6 chuyên đề • 18 giờ học</div>
        </div>
      ),
    },
  ]

  return (
    <section id="courses" className="py-16">
      <div className="w-full px-4 text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black dark:text-white">
          Nội Dung <span className="text-primary">Khóa Học</span>
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-3xl mx-auto">
          Khóa học gồm 4 phần chính với 24 chuyên đề, mỗi phần tập trung giải quyết những khía cạnh cụ thể trong đời
          sống tâm lý cá nhân và xã hội
        </p>
      </div>

      <Timeline data={timelineData} />

      <div className="container mx-auto px-4">
        <div className="text-center mt-12">
          <div className="bg-muted/30 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Thông Tin Khóa Học</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">72 giờ</div>
                <div className="text-sm text-muted-foreground">Tổng thời lượng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">48 buổi</div>
                <div className="text-sm text-muted-foreground">Số buổi học</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">4 tháng</div>
                <div className="text-sm text-muted-foreground">Thời gian hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
