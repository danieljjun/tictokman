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

  useEffect(() => {
    // localStorage에서 포트폴리오 데이터 로드
    const loadPortfolios = () => {
      const savedPortfolios = localStorage.getItem('portfolios')
      if (savedPortfolios) {
        const allPortfolios = JSON.parse(savedPortfolios)
        // 최신순으로 정렬
        const sortedPortfolios = [...allPortfolios].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setPortfolios(sortedPortfolios)
      }
    }

    // 초기 로드
    loadPortfolios()

    // storage 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolios') {
        loadPortfolios()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
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