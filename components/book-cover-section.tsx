"use client"

export default function BookCoverSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="group relative flex items-center justify-center w-96 h-[500px] cursor-pointer">
              {/* Book 1 - Far left */}
              <div className="absolute transition-all duration-500 ease-out transform -rotate-12 -translate-x-20 group-hover:-rotate-20 group-hover:-translate-x-32 group-hover:opacity-90 opacity-70 z-10">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TLH%20Cover-qEsUpEL4vhP4Uc7lj9Vs9aDlwQMU6T.png"
                  alt="Sách Tâm Lý Hành Vi & Xã Hội - Huỳnh Chí Viễn"
                  className="w-64 h-auto rounded-lg shadow-xl"
                />
              </div>

              {/* Book 2 - Left */}
              <div className="absolute transition-all duration-500 ease-out transform -rotate-6 -translate-x-10 group-hover:-rotate-10 group-hover:-translate-x-16 group-hover:opacity-95 opacity-80 z-20">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TLH%20Cover-qEsUpEL4vhP4Uc7lj9Vs9aDlwQMU6T.png"
                  alt="Sách Tâm Lý Hành Vi & Xã Hội - Huỳnh Chí Viễn"
                  className="w-72 h-auto rounded-lg shadow-xl"
                />
              </div>

              {/* Book 3 - Center (main) */}
              <div className="relative transition-all duration-500 ease-out transform group-hover:scale-105 z-30">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TLH%20Cover-qEsUpEL4vhP4Uc7lj9Vs9aDlwQMU6T.png"
                  alt="Sách Tâm Lý Hành Vi & Xã Hội - Huỳnh Chí Viễn"
                  className="w-80 h-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Book 4 - Right */}
              <div className="absolute transition-all duration-500 ease-out transform rotate-6 translate-x-10 group-hover:rotate-10 group-hover:translate-x-16 group-hover:opacity-95 opacity-80 z-20">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TLH%20Cover-qEsUpEL4vhP4Uc7lj9Vs9aDlwQMU6T.png"
                  alt="Sách Tâm Lý Hành Vi & Xã Hội - Huỳnh Chí Viễn"
                  className="w-72 h-auto rounded-lg shadow-xl"
                />
              </div>

              {/* Book 5 - Far right */}
              <div className="absolute transition-all duration-500 ease-out transform rotate-12 translate-x-20 group-hover:rotate-20 group-hover:translate-x-32 group-hover:opacity-90 opacity-70 z-10">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TLH%20Cover-qEsUpEL4vhP4Uc7lj9Vs9aDlwQMU6T.png"
                  alt="Sách Tâm Lý Hành Vi & Xã Hội - Huỳnh Chí Viễn"
                  className="w-64 h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
