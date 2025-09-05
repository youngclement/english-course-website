"use client"

export default function CourseHighlightSection() {
  return (
    <section className="py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://i.pinimg.com/736x/b3/15/52/b315527f272a1a00df44206a286308b7.jpg)'}}>
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-[#004976]/75"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            KHOÁ HỌC TÂM LÝ HỌC<br />HÀNH VI & XÃ HỘI
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 font-semibold ">
            Khoá học <span className="text-white font-bold">ĐỘC QUYỀN</span> chỉ diễn ra 1 lần trong năm.
          </p>
          
        
        </div>
      </div>
    </section>
  )
}
