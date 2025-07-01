export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            모든 운동은 <br />
            <span className="text-blue-600">Total Check</span> 이후 시작됩니다.
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            인피니티짐 PCU 시스템, 체형 AI 분석, 동작 자세 AI를 통해 <br />
            구체적이고 체계적인 분석 결과를 제시하여 철저하고 안전한 운동을 약속합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center">
              세션 예약하기
            </a>
            <a href="/payment" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center">
              온라인 결제
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 