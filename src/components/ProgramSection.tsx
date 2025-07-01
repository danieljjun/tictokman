export default function ProgramSection() {
  const programs = [
    { name: "재활운동", icon: "🏥" },
    { name: "자세교정", icon: "🧘‍♀️" },
    { name: "다이어트", icon: "🥗" },
    { name: "벌크업", icon: "💪" },
    { name: "산후관리", icon: "👶" },
    { name: "웨딩 PT", icon: "💒" }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            전문 프로그램
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3">{program.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 