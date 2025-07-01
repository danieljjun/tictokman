'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ReviewsPage() {
  const [isWriting, setIsWriting] = useState(false)
  const [newReview, setNewReview] = useState({
    name: '',
    program: '',
    rating: 5,
    content: ''
  })

  const reviews = [
    {
      id: 1,
      name: "김사라",
      program: "자세교정",
      rating: 5,
      content: "AI 분석이 정말 놀라웠어요! 2개월 만에 자세가 극적으로 개선되었습니다. 트레이너분이 정말 전문적이시고, PCU 시스템으로 내 몸 상태를 정확히 파악할 수 있어서 좋았어요.",
      date: "2024-01-15",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      name: "박민수",
      program: "벌크업",
      rating: 5,
      content: "건강을 위한 최고의 투자였습니다. 개인 맞춤 프로그램이 정말 효과적이에요. 3개월 만에 목표했던 체중을 달성했고, 무엇보다 안전하게 운동할 수 있어서 만족합니다.",
      date: "2024-01-10",
      avatar: "👨‍💼"
    },
    {
      id: 3,
      name: "이지은",
      program: "산후관리",
      rating: 5,
      content: "산후관리 프로그램이 정말 좋았어요. 강력 추천합니다! 출산 후 변한 몸을 예전처럼 회복할 수 있도록 도와주셔서 감사해요. 체형 AI 분석이 특히 도움이 되었습니다.",
      date: "2024-01-08",
      avatar: "👩‍⚕️"
    },
    {
      id: 4,
      name: "최현우",
      program: "다이어트",
      rating: 4,
      content: "6개월 동안 15kg 감량에 성공했습니다! 운동 자세 AI 측정 덕분에 부상 없이 안전하게 운동할 수 있었어요. 식단 관리도 함께 해주셔서 더욱 효과적이었습니다.",
      date: "2024-01-05",
      avatar: "👨‍🎓"
    },
    {
      id: 5,
      name: "정미영",
      program: "웨딩 PT",
      rating: 5,
      content: "결혼식 전 3개월 동안 웨딩 PT를 받았는데, 정말 만족스러운 결과였어요! 드레스 핏이 완벽했고, 웨딩 사진도 자신감 있게 찍을 수 있었습니다. 감사합니다!",
      date: "2024-01-03",
      avatar: "👰‍♀️"
    }
  ]

  const programs = ['재활운동', '자세교정', '다이어트', '벌크업', '산후관리', '웨딩 PT']

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.name || !newReview.content) {
      alert('이름과 후기 내용을 입력해주세요.')
      return
    }
    alert('후기가 성공적으로 등록되었습니다!')
    setIsWriting(false)
    setNewReview({ name: '', program: '', rating: 5, content: '' })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              회원 후기
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              인피니티짐에서 운동하신 회원분들의 생생한 후기를 확인해보세요
            </p>
            <button
              onClick={() => setIsWriting(!isWriting)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {isWriting ? '취소' : '후기 작성하기'}
            </button>
          </div>

          {/* 후기 작성 폼 */}
          {isWriting && (
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">후기 작성</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="성함을 입력해주세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">프로그램</label>
                    <select
                      value={newReview.program}
                      onChange={(e) => setNewReview({...newReview, program: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">프로그램을 선택해주세요</option>
                      {programs.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">평점</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">후기 내용</label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="운동 경험과 느낀 점을 자유롭게 작성해주세요"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  후기 등록하기
                </button>
              </form>
            </div>
          )}

          {/* 후기 목록 */}
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{review.avatar}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.program} • {review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>

          {/* 통계 */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">회원 만족도</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
                <div className="text-gray-600">평균 평점</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                <div className="text-gray-600">총 후기 수</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">재등록률</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 