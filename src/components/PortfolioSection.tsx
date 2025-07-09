'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Portfolio {
  id: number
  title: string
  category: string
  beforeImage: string
  afterImage: string
  description: string
  date: string
}

export default function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([])

  useEffect(() => {
    const loadPortfolio = () => {
      try {
        const savedPortfolio = localStorage.getItem('portfolioItems')
        if (savedPortfolio) {
          const parsedPortfolio = JSON.parse(savedPortfolio)
          // 최근 3개 항목만 표시
          setPortfolioItems(parsedPortfolio.slice(0, 3))
        }
      } catch (error) {
        console.error('Error loading portfolio:', error)
      }
    }

    loadPortfolio()

    // localStorage 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolioItems') {
        loadPortfolio()
      }
    }

    // 커스텀 이벤트 감지
    const handlePortfolioUpdate = () => {
      loadPortfolio()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('portfolioUpdated', handlePortfolioUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('portfolioUpdated', handlePortfolioUpdate)
    }
  }, [])

  if (portfolioItems.length === 0) {
    return null // 포트폴리오 항목이 없으면 섹션을 표시하지 않음
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            최근 성공 사례
          </h2>
          <p className="text-xl text-gray-600">
            실제 회원들의 놀라운 변화를 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 relative">
                    <Image
                      src={item.beforeImage}
                      alt={`${item.title} Before`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  </div>
                  <div className="w-1/2 relative">
                    <Image
                      src={item.afterImage}
                      alt={`${item.title} After`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <Link
                    href="/portfolio"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            전체 포트폴리오 보기
          </Link>
        </div>
      </div>
    </section>
  )
} 