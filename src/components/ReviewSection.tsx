export default function ReviewSection() {
  const reviews = [
    {
      name: "김사라",
      review: "AI 분석이 정말 놀라웠어요! 2개월 만에 자세가 극적으로 개선되었습니다.",
      avatar: "👩‍💼"
    },
    {
      name: "박민수", 
      review: "건강을 위한 최고의 투자였습니다. 개인 맞춤 프로그램이 정말 효과적이에요.",
      avatar: "👨‍💼"
    },
    {
      name: "이지은",
      review: "산후관리 프로그램이 정말 좋았어요. 강력 추천합니다!",
      avatar: "👩‍⚕️"
    }
  ]

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            실시간 회원 후기
          </h2>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            후기 작성하기
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{review.avatar}</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{review.name}</h4>
                </div>
              </div>
              <p className="text-gray-600 italic">"{review.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 