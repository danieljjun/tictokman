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
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    // localStorage에서 배너 설정 로드
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('bannerSettings')
        console.log('Loading banner settings from localStorage:', savedSettings)
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          console.log('Parsed banner settings:', parsedSettings)
          
          // 데이터 유효성 검증 강화
          if (parsedSettings && typeof parsedSettings === 'object') {
            if (Array.isArray(parsedSettings.items)) {
              // 각 아이템의 유효성 검사
              const validItems = parsedSettings.items.filter((item: any): item is BannerItem => {
                if (!item || typeof item !== 'object') {
                  console.error('Invalid banner item:', item)
                  return false
                }
                if (!item.type || !['image', 'video'].includes(item.type)) {
                  console.error('Invalid banner type:', item.type)
                  return false
                }
                if (!item.url) {
                  console.error('Missing banner URL:', item)
                  return false
                }
                // URL 유효성 검사
                if (!(item.url.startsWith('/') || 
                    item.url.startsWith('http') || 
                    item.url.startsWith('data:'))) {
                  console.error('Invalid banner URL format:', item.url)
                  return false
                }
                return true
              })

              console.log('Valid banner items:', validItems)
              setSettings({
                ...parsedSettings,
                items: validItems
              })
              return
            } else {
              console.error('Invalid banner settings: items is not an array')
            }
          } else {
            console.error('Invalid banner settings format')
          }
        } else {
          console.log('No saved banner settings found')
        }
        
        // 기본 설정으로 폴백
        console.log('Falling back to default settings')
        setSettings({
          interval: 5000,
          height: 500,
          items: []
        })
      } catch (error) {
        console.error('Error loading banner settings:', error)
        console.log('Falling back to default settings due to error')
        setSettings({
          interval: 5000,
          height: 500,
          items: []
        })
      }
    }

    // 초기 로딩
    loadSettings()

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bannerSettings') {
        console.log('Storage changed, reloading banner settings')
        console.log('New value:', e.newValue)
        loadSettings()
      }
    }

    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 변경 감지)
    const handleBannerUpdate = () => {
      console.log('Banner update event received, reloading settings')
      loadSettings()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerSettingsUpdated', handleBannerUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerSettingsUpdated', handleBannerUpdate)
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

  // 현재 배너가 변경될 때 비디오 로딩 상태 리셋
  useEffect(() => {
    setVideoLoading(false)
    setVideoError(null)
  }, [currentIndex])

  console.log('Banner component render - settings:', settings)
  console.log('Current index:', currentIndex)
  console.log('Total items:', settings.items.length)
  console.log('Settings items:', settings.items)

  if (settings.items.length === 0) {
    console.log('No banners to display')
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
  console.log('Current banner item:', currentItem)

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
      className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 pt-16 md:pt-16"
      style={{ height: `${settings.height + 64}px` }}
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

      {/* 배너 내용 컨테이너 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentItem.type === 'image' ? (
          <Image
            src={currentItem.url}
            alt={currentItem.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <video
            src={currentItem.url}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onLoadStart={() => setVideoLoading(true)}
            onLoadedData={() => setVideoLoading(false)}
            onError={(e) => {
              console.error('Video error:', e)
              setVideoError('비디오를 불러오는데 실패했습니다.')
              setVideoLoading(false)
            }}
          />
        )}
      </div>

      {/* 배너 텍스트 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {currentItem.title}
          </h2>
          <p className="text-xl md:text-2xl text-white drop-shadow-lg">
            {currentItem.description}
          </p>
        </div>
      </div>

      {/* 배너 텍스트 */}
      <div className={`absolute inset-0 flex items-center justify-center ${
        (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') || currentItem.type === 'video' ? 'bg-black/30' : ''
      }`}>
        <div className="text-center max-w-4xl mx-auto px-4">
          {currentItem.title && (
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
              (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') || currentItem.type === 'video' ? 'text-white' : 'text-gray-900'
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
              (currentItem.url !== '/banner-default.jpg' && currentItem.url) || currentItem.url.startsWith('data:') || currentItem.type === 'video' ? 'text-white' : 'text-gray-600'
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