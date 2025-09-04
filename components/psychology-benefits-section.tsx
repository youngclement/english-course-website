export default function PsychologyBenefitsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div className="gsap-fade-in">
            <h2 className="text-3xl font-bold text-balance mb-4">
              Khám Phá <span className="text-primary">Thế Giới Tâm Lý</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tâm lý học là công cụ thực tế giúp bạn hiểu rõ bản thân và xây dựng cuộc sống hạnh phúc hơn.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-muted-foreground text-sm">Hiểu sâu về tâm lý hành vi con người</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-muted-foreground text-sm">Phát triển kỹ năng giao tiếp và EQ</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-muted-foreground text-sm">Ứng dụng thực tế trong cuộc sống</span>
              </div>
            </div>
          </div>

          <div className="relative gsap-scale-in">
            <img
              src="/psychology-therapy-session.png"
              alt="Psychology Therapy Session"
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
