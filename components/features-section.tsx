export default function FeaturesSection() {
  const objectives = [
    {
      title: "Hiểu Đúng Tâm Lý Hành Vi",
      description: "Hiểu đúng về tâm lý hành vi cá nhân và xã hội thời hiện đại.",
      image: "/course-desc-1.jpg",
    },
    {
      title: "Phân Tích & Ứng Dụng",
      description:
        "Phân tích, lý giải và ứng dụng kiến thức tâm lý trong các mối quan hệ cá nhân, gia đình, tình cảm, công việc và xã hội.",
      image: "/course-desc-2.png",
    },
    {
      title: "Phát Triển EQ & Giao Tiếp",
      description: "Phát triển trí tuệ cảm xúc (EQ), khả năng tư duy phản biện và kỹ năng giao tiếp.",
      image: "/course-desc-3.jpg",
    },
    {
      title: "Nuôi Dạy Con Khoa Học",
      description: "Nuôi dạy con khoa học, văn minh với sự thấu hiểu tâm lý sâu sắc.",
      image: "/course-desc-4.jpg",
    },
    {
      title: "Thay Đổi Nhận Thức",
      description: "Thay đổi nhận thức và hành vi để sống hạnh phúc và thành công trọn vẹn.",
      image: "/course-desc-9.png",
    },
  ]

  return (
    <section className="py-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-balance mb-3 gsap-fade-in">
            Khóa Học Hướng Đến <span className="text-primary">Mục Tiêu</span>
          </h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto gsap-fade-in">
            Trang bị cho học viên khả năng hiểu và ứng dụng kiến thức tâm lý trong cuộc sống
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-20">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
            >
              {/* Content */}
              <div className="flex-1 gsap-fade-in">
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">{objective.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{objective.description}</p>
              </div>

              {/* Image */}
              <div className="flex-1 gsap-scale-in">
                <div className="relative">
                  <img
                    src={objective.image || "/placeholder.svg"}
                    alt={objective.title}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
