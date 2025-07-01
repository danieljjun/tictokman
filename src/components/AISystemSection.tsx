export default function AISystemSection() {
  const systems = [
    {
      title: "PCU 시스템",
      description: "종합적인 신체 능력 점수 시스템으로 개인별 체력 수준을 정확히 측정합니다",
      icon: "📊"
    },
    {
      title: "체형 AI 분석",
      description: "고급 골격 오버레이 분석으로 자세 불균형과 체형 문제를 정확히 진단합니다",
      icon: "🤖"
    },
    {
      title: "운동 자세 AI 측정",
      description: "실시간 동작 분석으로 올바른 운동 자세를 교정하고 부상을 예방합니다",
      icon: "📹"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI 기반 진단 시스템
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {systems.map((system, index) => (
            <div key={index} className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">{system.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{system.title}</h3>
              <p className="text-gray-600 leading-relaxed">{system.description}</p>
              <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                {system.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 