'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BannerItem {
  id: number
  type: 'image' | 'video'
  url: string
  title: string
  description: string
}

interface BannerSettings {
  interval: number
  height: number
  items: BannerItem[]
}

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [settings, setSettings] = useState<BannerSettings>({
    interval: 5000,
    height: 500,
    items: []
  })

  useEffect(() => {
    // localStorage에서 배너 설정 로드
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('bannerSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }

    loadSettings()

    // storage 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bannerSettings') {
        loadSettings()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // 자동 전환을 위한 useEffect
  useEffect(() => {
    if (settings.items.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => 
        current === settings.items.length - 1 ? 0 : current + 1
      )
    }, settings.interval)

    return () => clearInterval(interval)
  }, [settings.interval, settings.items.length])

  if (settings.items.length === 0) {
    return (
      <div 
        className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
        style={{ height: `${settings.height}px` }}
      >
        <p className="text-gray-500">등록된 배너가 없습니다</p>
      </div>
    )
  }

  const currentItem = settings.items[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex(current => 
      current === 0 ? settings.items.length - 1 : current - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(current => 
      current === settings.items.length - 1 ? 0 : current + 1
    )
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{ height: `${settings.height}px` }}
    >
      {/* 이전/다음 버튼 */}
      {settings.items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            aria-label="이전 배너"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            aria-label="다음 배너"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* 배너 콘텐츠 */}
      {currentItem.type === 'image' && currentItem.url !== '/banner-default.jpg' && (
        currentItem.url.startsWith('data:') ? (
          // Base64 데이터 URL인 경우
          <img
            src={currentItem.url}
            alt={currentItem.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // 일반 URL인 경우
          <Image
            src={currentItem.url}
            alt={currentItem.title}
            fill
            className="object-cover"
          />
        )
      )}
      {currentItem.type === 'video' && currentItem.url && (
        <video
          src={currentItem.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Video loading error:', e)
          }}
        />
      )}

      {/* 배너 텍스트 */}
      <div className={`absolute inset-0 flex items-center justify-center ${
        (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') ? 'bg-black/30' : ''
      }`}>
        <div className="text-center max-w-4xl mx-auto px-4">
          {currentItem.title && (
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
              (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') ? 'text-white' : 'text-gray-900'
            }`}>
              {currentItem.title.split(' ').map((word, i) => (
                <span key={i} className={word === 'Total' || word === 'Check' ? 'text-blue-600' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>
          )}
          {currentItem.description && (
            <p className={`text-xl mb-8 whitespace-pre-line ${
              (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') ? 'text-white' : 'text-gray-600'
            }`}>
              {currentItem.description}
            </p>
          )}
          {currentItem.url === '/banner-default.jpg' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/booking" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center">
                세션 예약하기
              </a>
              <a href="/payment" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center">
                온라인 결제
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 인디케이터 */}
      {settings.items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {settings.items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 