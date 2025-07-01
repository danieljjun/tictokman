'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PortfolioItem {
  id: number
  title: string
  description: string
  beforeImage: string
  afterImage: string
  program: string
  duration: string
  results: string[]
  date: string
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([])
  const [selectedProgram, setSelectedProgram] = useState('전체')

  const programs = ['전체', '다이어트', '벌크업', '자세교정', '산후관리', '웨딩 PT', '재활운동']

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const samplePortfolios: PortfolioItem[] = [
    {
      id: 1,
      title: "김민지님의 다이어트 성공 스토리",
      description: "6개월간의 체계적인 다이어트 프로그램을 통해 15kg 감량에 성공하셨습니다. AI 자세 분석과 개인 맞춤 운동으로 건강하게 목표를 달성했습니다.",
      beforeImage: "/api/placeholder/300/400",
      afterImage: "/api/placeholder/300/400", 
      program: "다이어트",
      duration: "6개월",
      results: ["15kg 감량", "체지방률 12% 감소", "근육량 유지"],
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "박준호님의 벌크업 성공 사례",
      description: "4개월간의 집중적인 벌크업 프로그램으로 근육량 8kg 증가를 달성하셨습니다. PCU 시스템을 통한 정확한 체력 측정으로 최적의 운동 강도를 유지했습니다.",
      beforeImage: "/api/placeholder/300/400",
      afterImage: "/api/placeholder/300/400",
      program: "벌크업", 
      duration: "4개월",
      results: ["근육량 8kg 증가", "체중 12kg 증가", "벤치프레스 30kg 향상"],
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "이서연님의 자세교정 개선 후기",
      description: "장시간 책상 업무로 인한 거북목과 라운드숄더가 크게 개선되었습니다. 체형 AI 분석으로 정확한 문제점을 파악하고 맞춤 운동을 진행했습니다.",
      beforeImage: "/api/placeholder/300/400",
      afterImage: "/api/placeholder/300/400",
      program: "자세교정",
      duration: "3개월", 
      results: ["거북목 20도 개선", "어깨 균형 교정", "요통 완화"],
      date: "2024-01-05"
    },
    {
      id: 4,
      title: "정미영님의 산후관리 성공 케이스",
      description: "출산 후 변화된 체형을 건강하게 회복했습니다. 안전한 운동 강도와 전문적인 산후 케어 프로그램으로 이전보다 더 건강한 몸을 만들었습니다.",
      beforeImage: "/api/placeholder/300/400",
      afterImage: "/api/placeholder/300/400",
      program: "산후관리",
      duration: "5개월",
      results: ["출산 전 체중 회복", "복부 근력 강화", "전신 체력 향상"],
      date: "2024-01-01"
    },
    {
      id: 5,
      title: "최현우님의 웨딩 PT 완성",
      description: "결혼식을 앞두고 3개월간 집중 관리를 통해 완벽한 웨딩 바디를 완성했습니다. 턱시도가 완벽하게 어울리는 멋진 몸매를 만들어냈습니다.",
      beforeImage: "/api/placeholder/300/400",
      afterImage: "/api/placeholder/300/400",
      program: "웨딩 PT",
      duration: "3개월",
      results: ["체지방 8% 감소", "어깨 라인 완성", "전체적인 체형 개선"],
      date: "2023-12-25"
    },
    {
      id: 6,
      title: "홍길동님의 재활운동 회복 과정",
      description: "무릎 수술 후 재활 과정을 거쳐 완전한 일상 복귀에 성공했습니다. 전문 재활 트레이너와 함께 안전하고 체계적인 회복 프로그램을 진행했습니다.",
      beforeImage: "/api/placeholder/300/400", 
      afterImage: "/api/placeholder/300/400",
      program: "재활운동",
      duration: "4개월",
      results: ["무릎 기능 100% 회복", "근력 90% 회복", "일상생활 완전 복귀"],
      date: "2023-12-20"
    }
  ]

  useEffect(() => {
    // 최신순으로 정렬하여 설정
    const sortedPortfolios = [...samplePortfolios].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setPortfolios(sortedPortfolios)
  }, [])

  const filteredPortfolios = selectedProgram === '전체' 
    ? portfolios 
    : portfolios.filter(item => item.program === selectedProgram)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              트랜스포메이션 포트폴리오
            </h1>
            <p className="text-xl text-gray-600">
              인피니티짐에서 이루어낸 놀라운 변화들을 확인해보세요
            </p>
          </div>

          {/* 프로그램 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {programs.map((program) => (
              <button
                key={program}
                onClick={() => setSelectedProgram(program)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedProgram === program
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } border border-gray-200`}
              >
                {program}
              </button>
            ))}
          </div>

          {/* 포트폴리오 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Before & After 이미지 */}
                <div className="relative">
                  <div className="grid grid-cols-2">
                    {/* Before 이미지 */}
                    <div className="relative">
                      <img
                        src={item.beforeImage}
                        alt={`${item.title} - Before`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        BEFORE
                      </div>
                    </div>
                    
                    {/* After 이미지 */}
                    <div className="relative">
                      <img
                        src={item.afterImage}
                        alt={`${item.title} - After`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        AFTER
                      </div>
                    </div>
                  </div>
                  
                  {/* 중앙 구분선 */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-0.5"></div>
                </div>

                {/* 컨텐츠 */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item.program}
                    </span>
                    <span className="text-sm text-gray-500">{item.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* 성과 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">주요 성과</h4>
                    <ul className="space-y-1">
                      {item.results.map((result, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 날짜 */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      완료일: {new Date(item.date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 빈 상태 */}
          {filteredPortfolios.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                해당 프로그램의 포트폴리오가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 프로그램을 선택해보시거나 전체를 확인해보세요
              </p>
            </div>
          )}

          {/* CTA 섹션 */}
          <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              당신도 이런 변화를 경험해보세요!
            </h2>
            <p className="text-xl mb-6">
              전문 트레이너와 AI 기술로 더욱 효과적인 운동을 시작하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                무료 상담 예약
              </a>
              <a
                href="/payment"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                멤버십 가입
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 