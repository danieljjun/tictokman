'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Portfolio {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  date: string
  beforeImage?: string
  afterImage?: string
  program: string
  duration: string
  results: string[]
}

interface Reservation {
  id: number
  time: string
  date: string
  customerName: string
  customerPhone: string
  program: string
  trainer: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface Member {
  id: number
  name: string
  phone: string
  email: string
  program: string
  joinDate: string
  status: 'active' | 'inactive'
}

interface Review {
  id: number
  name: string
  program: string
  rating: number
  content: string
  date: string
  status: 'approved' | 'pending' | 'rejected'
}

export default function AdminContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [baseStats, setBaseStats] = useState({
    totalReservations: 0,
    totalRegistered: 0
  })
  const [tempBaseStats, setTempBaseStats] = useState({
    totalReservations: 0,
    totalRegistered: 0
  })

  // 배너 관리 상태 추가
  interface BannerItem {
    id: number
    type: 'image' | 'video'
    url: string
    title: string
    description: string
  }

  interface BannerSettings {
    interval: number
    height: number // 배너 높이 (px)
    items: BannerItem[]
  }

  // 결제 설정 상태 추가
  interface PaymentSettings {
    enabled: boolean
    paymentMethods: {
      card: boolean
      bankTransfer: boolean
      kakaoPay: boolean
      naverPay: boolean
    }
    programs: {
      id: number
      name: string
      price: number
      description: string
      duration: string
      active: boolean
    }[]
    taxSettings: {
      includeTax: boolean
      taxRate: number
    }
    notificationSettings: {
      emailNotification: boolean
      smsNotification: boolean
      adminEmail: string
      adminPhone: string
    }
  }

  const defaultBanner: BannerItem = {
    id: 1,
    type: 'image',
    url: '/banner-default.jpg',
    title: '모든 운동은 Total Check 이후 시작됩니다.',
    description: '인피니티짐 PCU 시스템, 체형 AI 분석, 동작 자세 AI를 통해\n구체적이고 체계적인 분석 결과를 제시하여 철저하고 안전한 운동을 약속합니다.'
  }

  const defaultSettings: BannerSettings = {
    interval: 5000,
    height: 500,
    items: [defaultBanner]
  }

  const defaultPaymentSettings: PaymentSettings = {
    enabled: true,
    paymentMethods: {
      card: true,
      bankTransfer: true,
      kakaoPay: false,
      naverPay: false
    },
    programs: [
      {
        id: 1,
        name: '기본 멤버십',
        price: 150000,
        description: '기본 운동기구 이용, PCU 시스템 이용, 샤워시설 이용',
        duration: '1개월',
        active: true
      },
      {
        id: 2,
        name: '프리미엄 멤버십',
        price: 400000,
        description: '모든 운동기구 이용, AI 분석 시스템, 개인 트레이너 월 2회, 영양 상담',
        duration: '3개월',
        active: true
      },
      {
        id: 3,
        name: 'VIP 멤버십',
        price: 800000,
        description: '모든 시설 무제한, AI 분석 시스템, 개인 트레이너 주 2회, 영양 상담, 마사지 서비스',
        duration: '6개월',
        active: true
      },
      {
        id: 4,
        name: '개인 PT 세션',
        price: 80000,
        description: '1:1 개인 트레이닝, AI 자세 분석, 운동 프로그램 설계',
        duration: '1회',
        active: true
      }
    ],
    taxSettings: {
      includeTax: true,
      taxRate: 10
    },
    notificationSettings: {
      emailNotification: true,
      smsNotification: true,
      adminEmail: 'admin@infinitygym.com',
      adminPhone: '010-1234-5678'
    }
  }

  const [bannerSettings, setBannerSettings] = useState<BannerSettings>(defaultSettings)
  const [tempBannerSettings, setTempBannerSettings] = useState<BannerSettings>(defaultSettings)
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null)

  // 결제 설정 상태
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings)
  const [tempPaymentSettings, setTempPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings)
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null)

  // localStorage 초기화는 useEffect에서만 처리
  useEffect(() => {
    console.log('AdminContent: Initializing localStorage settings')
    
    // 배너 설정 로드
    try {
      const savedSettings = localStorage.getItem('bannerSettings')
      console.log('AdminContent: Loading banner settings:', savedSettings)
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        console.log('AdminContent: Parsed banner settings:', parsed)
        
        if (parsed && Array.isArray(parsed.items)) {
          setBannerSettings(parsed)
          setTempBannerSettings(parsed)
          console.log('AdminContent: Banner settings loaded successfully')
        } else {
          console.error('AdminContent: Invalid banner settings format')
          localStorage.setItem('bannerSettings', JSON.stringify(defaultSettings))
          setBannerSettings(defaultSettings)
          setTempBannerSettings(defaultSettings)
        }
      } else {
        console.log('AdminContent: No saved banner settings, using defaults')
        localStorage.setItem('bannerSettings', JSON.stringify(defaultSettings))
        setBannerSettings(defaultSettings)
        setTempBannerSettings(defaultSettings)
      }
    } catch (error) {
      console.error('AdminContent: Error loading banner settings:', error)
      localStorage.setItem('bannerSettings', JSON.stringify(defaultSettings))
      setBannerSettings(defaultSettings)
      setTempBannerSettings(defaultSettings)
    }

    // 결제 설정 로드
    try {
      const savedPaymentSettings = localStorage.getItem('paymentSettings')
      if (savedPaymentSettings) {
        const parsed = JSON.parse(savedPaymentSettings)
        setPaymentSettings(parsed)
        setTempPaymentSettings(parsed)
      } else {
        localStorage.setItem('paymentSettings', JSON.stringify(defaultPaymentSettings))
      }
    } catch (error) {
      console.error('AdminContent: Error loading payment settings:', error)
      localStorage.setItem('paymentSettings', JSON.stringify(defaultPaymentSettings))
    }
  }, [])

  // storage 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bannerSettings' && e.newValue) {
        const newSettings = JSON.parse(e.newValue)
        setBannerSettings(newSettings)
        setTempBannerSettings(newSettings)
      }
      if (e.key === 'paymentSettings' && e.newValue) {
        const newSettings = JSON.parse(e.newValue)
        setPaymentSettings(newSettings)
        setTempPaymentSettings(newSettings)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 배너 설정 저장 및 자동 연동
  const saveBannerSettings = () => {
    try {
      console.log('Saving banner settings:', tempBannerSettings)

      // 배너 설정 유효성 검사
      if (!tempBannerSettings || !Array.isArray(tempBannerSettings.items)) {
        console.error('Invalid banner settings format')
        alert('배너 설정 형식이 올바르지 않습니다.')
        return
      }

      // Base64 데이터 크기 검사
      const totalSize = tempBannerSettings.items.reduce((size, item) => {
        if (item.url.startsWith('data:')) {
          return size + item.url.length
        }
        return size
      }, 0)

      console.log('Total banner data size:', totalSize)

      // localStorage 용량 제한 (약 5MB)
      if (totalSize > 5 * 1024 * 1024) {
        alert('배너 이미지/비디오의 총 크기가 너무 큽니다. 파일 크기를 줄여주세요.')
        return
      }

      // 설정 저장
      localStorage.setItem('bannerSettings', JSON.stringify(tempBannerSettings))
      setBannerSettings(tempBannerSettings)

      // 다른 탭/기기와의 동기화를 위한 이벤트 발생
      window.dispatchEvent(new Event('bannerSettingsUpdated'))
      
      console.log('Banner settings saved successfully')
      alert('배너 설정이 저장되었습니다.')
    } catch (error) {
      console.error('Error saving banner settings:', error)
      alert('배너 설정 저장 중 오류가 발생했습니다.')
    }
  }

  // 결제 설정 저장
  const savePaymentSettings = () => {
    setPaymentSettings(tempPaymentSettings)
    localStorage.setItem('paymentSettings', JSON.stringify(tempPaymentSettings))
    alert('결제 설정이 저장되었습니다.')
  }

  // 새 배너 추가 시 자동 저장
  const handleAddBanner = (newBanner: BannerItem) => {
    console.log('Adding new banner:', newBanner)
    
    // 임시 설정과 실제 설정 모두 업데이트
    const updatedSettings = {
      ...tempBannerSettings,
      items: [...tempBannerSettings.items, newBanner]
    }
    
    setTempBannerSettings(updatedSettings)
    setBannerSettings(updatedSettings)
    
    // localStorage에 저장
    try {
      localStorage.setItem('bannerSettings', JSON.stringify(updatedSettings))
      console.log('Banner settings saved to localStorage:', updatedSettings)
      
      // 커스텀 이벤트 발생
      const event = new Event('bannerSettingsUpdated')
      window.dispatchEvent(event)
      
      // storage 이벤트를 수동으로 트리거
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bannerSettings',
        newValue: JSON.stringify(updatedSettings),
        storageArea: localStorage
      }))
    } catch (error) {
      console.error('Error saving banner settings:', error)
    }
  }

  // 배너 수정 함수 추가
  const handleUpdateBanner = (id: number, updatedBanner: BannerItem) => {
    console.log('Updating banner:', id, updatedBanner)
    
    // 임시 설정과 실제 설정 모두 업데이트
    const updatedSettings = {
      ...tempBannerSettings,
      items: tempBannerSettings.items.map(item =>
        item.id === id ? updatedBanner : item
      )
    }
    
    setTempBannerSettings(updatedSettings)
    setBannerSettings(updatedSettings)
    
    // localStorage에 저장
    try {
      localStorage.setItem('bannerSettings', JSON.stringify(updatedSettings))
      console.log('Updated banner settings saved to localStorage:', updatedSettings)
      
      // 커스텀 이벤트 발생
      const event = new Event('bannerSettingsUpdated')
      window.dispatchEvent(event)
      
      // storage 이벤트를 수동으로 트리거
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bannerSettings',
        newValue: JSON.stringify(updatedSettings),
        storageArea: localStorage
      }))
    } catch (error) {
      console.error('Error saving updated banner settings:', error)
    }
  }

  // 배너 삭제 함수 수정
  const handleDeleteBanner = (id: number) => {
    console.log('Deleting banner:', id)
    
    // 임시 설정과 실제 설정 모두 업데이트
    const updatedSettings = {
      ...tempBannerSettings,
      items: tempBannerSettings.items.filter(item => item.id !== id)
    }
    
    setTempBannerSettings(updatedSettings)
    setBannerSettings(updatedSettings)
    
    // localStorage에 저장
    try {
      localStorage.setItem('bannerSettings', JSON.stringify(updatedSettings))
      console.log('Banner settings after deletion saved to localStorage:', updatedSettings)
      
      // 커스텀 이벤트 발생
      const event = new Event('bannerSettingsUpdated')
      window.dispatchEvent(event)
      
      // storage 이벤트를 수동으로 트리거
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bannerSettings',
        newValue: JSON.stringify(updatedSettings),
        storageArea: localStorage
      }))
    } catch (error) {
      console.error('Error saving banner settings after deletion:', error)
    }
  }

  // 결제 프로그램 추가
  const handleAddProgram = (newProgram: PaymentSettings['programs'][0]) => {
    const updatedSettings = {
      ...tempPaymentSettings,
      programs: [...tempPaymentSettings.programs, { ...newProgram, id: Date.now() }]
    }
    setTempPaymentSettings(updatedSettings)
    setPaymentSettings(updatedSettings)
    localStorage.setItem('paymentSettings', JSON.stringify(updatedSettings))
  }

  // 결제 프로그램 삭제
  const handleDeleteProgram = (id: number) => {
    const updatedPrograms = tempPaymentSettings.programs.filter(program => program.id !== id)
    const updatedSettings = {
      ...tempPaymentSettings,
      programs: updatedPrograms
    }
    setTempPaymentSettings(updatedSettings)
    setPaymentSettings(updatedSettings)
    localStorage.setItem('paymentSettings', JSON.stringify(updatedSettings))
  }

  // 배너 관리 섹션 수정
  const BannerManagementSection = () => {
    const [file, setFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setUploadError(null)
      
      if (!file) {
        setUploadError('파일을 선택해주세요.')
        return
      }

      setIsUploading(true)
      console.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      })

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        console.log('Upload response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Upload failed:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          })
          
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.error || '파일 업로드에 실패했습니다.')
          } catch (parseError) {
            throw new Error(`파일 업로드 실패 (${response.status}): ${errorText || response.statusText}`)
          }
        }

        const data = await response.json()
        console.log('Upload successful:', {
          url: data.url?.substring(0, 50) + '...',
          type: data.type,
          size: data.url?.length
        })

        if (!data.url) {
          throw new Error('업로드된 파일의 URL이 없습니다.')
        }

        // 새 배너 아이템 생성
        const newBanner: BannerItem = {
          id: Date.now(),
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: data.url,
          title: '',
          description: ''
        }

        console.log('Creating new banner:', {
          id: newBanner.id,
          type: newBanner.type,
          urlLength: newBanner.url.length
        })
        
        // localStorage 현재 상태 확인
        const currentSettings = localStorage.getItem('bannerSettings')
        console.log('Current localStorage state:', {
          hasSettings: !!currentSettings,
          size: currentSettings?.length || 0
        })

        handleAddBanner(newBanner)

        // 폼 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setFile(null)
        setUploadError(null)

        // 저장 확인
        const savedSettings = localStorage.getItem('bannerSettings')
        console.log('Verification after save:', {
          hasSettings: !!savedSettings,
          size: savedSettings?.length || 0
        })
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.')
      } finally {
        setIsUploading(false)
      }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return

      const file = e.target.files[0]
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
      })

      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.')
        return null
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('이미지 또는 비디오 파일만 업로드 가능합니다.')
        return null
      }

      try {
        // 파일을 Base64로 변환
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            console.log('File converted to Base64, length:', result.length)
            resolve(result)
          }
          reader.onerror = (error) => {
            console.error('FileReader error:', error)
            reject(error)
          }
          reader.readAsDataURL(file)
        })

        // 이미지 최적화
        if (file.type.startsWith('image/')) {
          const optimizedImage = await new Promise<string>((resolve) => {
            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              const maxWidth = 1920
              const maxHeight = 1080
              let { width, height } = img

              if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height)
                width *= ratio
                height *= ratio
              }

              canvas.width = width
              canvas.height = height
              ctx?.drawImage(img, 0, 0, width, height)
              
              const optimized = canvas.toDataURL(file.type, 0.8)
              console.log('Image optimized, new length:', optimized.length)
              resolve(optimized)
            }
            img.src = base64
          })

          return optimizedImage
        }

        return base64
      } catch (error) {
        console.error('File processing error:', error)
        alert('파일 처리 중 오류가 발생했습니다.')
        return null
      }
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">배너 관리</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              배너 이미지/비디오 업로드
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {uploadError && (
              <p className="mt-1 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || isUploading}
            className={`px-4 py-2 rounded text-white ${
              !file || isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUploading ? '업로드 중...' : '업로드'}
          </button>
        </form>

        {/* 배너 목록 표시 */}
        <div className="mt-8">
          <h4 className="text-md font-medium mb-4">현재 배너 목록</h4>
          <div className="space-y-4">
            {tempBannerSettings.items.map((banner, index) => (
              <div
                key={banner.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span>{banner.type === 'video' ? '비디오' : '이미지'}</span>
                  <span className="text-sm text-gray-500 truncate max-w-md">
                    {banner.url}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 배너 설정 섹션
  const BannerSettingsSection = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">배너 설정</h2>
        
        {/* 전환 간격 설정 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            전환 간격 (초)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="60"
              value={tempBannerSettings.interval / 1000}
              onChange={(e) => {
                const seconds = Math.max(1, Math.min(60, Number(e.target.value)))
                setTempBannerSettings({
                  ...tempBannerSettings,
                  interval: seconds * 1000
                })
              }}
              className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="text-gray-600">초</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">1초 ~ 60초 사이로 설정해주세요.</p>
        </div>

        {/* 배너 높이 설정 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            배너 높이 (px)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="300"
              max="800"
              step="50"
              value={tempBannerSettings.height}
              onChange={(e) => {
                const height = Math.max(300, Math.min(800, Number(e.target.value)))
                setTempBannerSettings({
                  ...tempBannerSettings,
                  height
                })
              }}
              className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="text-gray-600">px</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">300px ~ 800px 사이로 설정해주세요.</p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={saveBannerSettings}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            설정 저장
          </button>
        </div>
      </div>
    )
  }

  // 결제 설정 섹션
  const PaymentSettingsSection = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">결제 설정</h2>
        
        {/* 결제 활성화 설정 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">결제 시스템 활성화</h3>
              <p className="text-sm text-gray-600">결제 기능을 활성화하거나 비활성화합니다.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempPaymentSettings.enabled}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    enabled: e.target.checked
                  })
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* 결제 방법 설정 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">결제 방법 설정</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.paymentMethods.card}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    paymentMethods: {
                      ...tempPaymentSettings.paymentMethods,
                      card: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">신용카드</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.paymentMethods.bankTransfer}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    paymentMethods: {
                      ...tempPaymentSettings.paymentMethods,
                      bankTransfer: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">계좌이체</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.paymentMethods.kakaoPay}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    paymentMethods: {
                      ...tempPaymentSettings.paymentMethods,
                      kakaoPay: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">카카오페이</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.paymentMethods.naverPay}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    paymentMethods: {
                      ...tempPaymentSettings.paymentMethods,
                      naverPay: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">네이버페이</span>
            </label>
          </div>
        </div>

        {/* 세금 설정 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">세금 설정</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.taxSettings.includeTax}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    taxSettings: {
                      ...tempPaymentSettings.taxSettings,
                      includeTax: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">부가세 포함</span>
            </label>
            {tempPaymentSettings.taxSettings.includeTax && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  부가세율 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={tempPaymentSettings.taxSettings.taxRate}
                  onChange={(e) => {
                    setTempPaymentSettings({
                      ...tempPaymentSettings,
                      taxSettings: {
                        ...tempPaymentSettings.taxSettings,
                        taxRate: Number(e.target.value)
                      }
                    })
                  }}
                  className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">알림 설정</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.notificationSettings.emailNotification}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    notificationSettings: {
                      ...tempPaymentSettings.notificationSettings,
                      emailNotification: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">이메일 알림</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tempPaymentSettings.notificationSettings.smsNotification}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    notificationSettings: {
                      ...tempPaymentSettings.notificationSettings,
                      smsNotification: e.target.checked
                    }
                  })
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">SMS 알림</span>
            </label>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                관리자 이메일
              </label>
              <input
                type="email"
                value={tempPaymentSettings.notificationSettings.adminEmail}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    notificationSettings: {
                      ...tempPaymentSettings.notificationSettings,
                      adminEmail: e.target.value
                    }
                  })
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                관리자 연락처
              </label>
              <input
                type="tel"
                value={tempPaymentSettings.notificationSettings.adminPhone}
                onChange={(e) => {
                  setTempPaymentSettings({
                    ...tempPaymentSettings,
                    notificationSettings: {
                      ...tempPaymentSettings.notificationSettings,
                      adminPhone: e.target.value
                    }
                  })
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="010-1234-5678"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={savePaymentSettings}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            설정 저장
          </button>
        </div>
      </div>
    )
  }

  // 멤버십 관리 섹션
  const PaymentProgramsSection = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingProgram, setEditingProgram] = useState<PaymentSettings['programs'][0] | null>(null)
    const [newProgram, setNewProgram] = useState({
      name: '',
      price: 0,
      description: '',
      duration: '',
      active: true
    })

    const handleAddProgram = (e: React.FormEvent) => {
      e.preventDefault()
      if (newProgram.name && newProgram.price > 0) {
        const programToAdd = {
          ...newProgram,
          id: Date.now()
        }
        
        const updatedSettings = {
          ...tempPaymentSettings,
          programs: [...tempPaymentSettings.programs, programToAdd]
        }
        setTempPaymentSettings(updatedSettings)
        setPaymentSettings(updatedSettings)
        localStorage.setItem('paymentSettings', JSON.stringify(updatedSettings))
        
        setNewProgram({
          name: '',
          price: 0,
          description: '',
          duration: '',
          active: true
        })
        setShowAddForm(false)
      }
    }

    const handleEditProgram = (e: React.FormEvent) => {
      e.preventDefault()
      if (editingProgram && editingProgram.name && editingProgram.price > 0) {
        const updatedSettings = {
          ...tempPaymentSettings,
          programs: tempPaymentSettings.programs.map(program => 
            program.id === editingProgram.id ? editingProgram : program
          )
        }
        setTempPaymentSettings(updatedSettings)
        setPaymentSettings(updatedSettings)
        localStorage.setItem('paymentSettings', JSON.stringify(updatedSettings))
        
        setEditingProgram(null)
      }
    }

    const handleCancelEdit = () => {
      setEditingProgram(null)
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">멤버십 관리</h2>
            <p className="text-gray-600 mt-1">결제 페이지에서 고객이 선택할 수 있는 멤버십을 관리합니다.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={editingProgram !== null}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              editingProgram !== null ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {showAddForm ? '취소' : '새 멤버십 추가'}
          </button>
        </div>

        {/* 새 멤버십 추가 폼 */}
        {showAddForm && (
          <form onSubmit={handleAddProgram} className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">새 멤버십 추가</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  멤버십명
                </label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="예: 기본 멤버십"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newProgram.price}
                  onChange={(e) => setNewProgram({...newProgram, price: Number(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  기간
                </label>
                <input
                  type="text"
                  value={newProgram.duration}
                  onChange={(e) => setNewProgram({...newProgram, duration: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="예: 1개월, 3개월, 1회"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  활성화
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newProgram.active}
                    onChange={(e) => setNewProgram({...newProgram, active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">활성화</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                제공 서비스 (쉼표로 구분)
              </label>
              <textarea
                value={newProgram.description}
                onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="예: 기본 운동기구 이용, PCU 시스템 이용, 샤워시설 이용"
                required
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                멤버십 추가
              </button>
            </div>
          </form>
        )}

        {/* 멤버십 수정 폼 */}
        {editingProgram && (
          <form onSubmit={handleEditProgram} className="mb-8 p-4 border rounded-lg bg-blue-50">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">멤버십 수정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  멤버십명
                </label>
                <input
                  type="text"
                  value={editingProgram.name}
                  onChange={(e) => setEditingProgram({...editingProgram, name: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="예: 기본 멤버십"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProgram.price}
                  onChange={(e) => setEditingProgram({...editingProgram, price: Number(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  기간
                </label>
                <input
                  type="text"
                  value={editingProgram.duration}
                  onChange={(e) => setEditingProgram({...editingProgram, duration: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="예: 1개월, 3개월, 1회"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  활성화
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={editingProgram.active}
                    onChange={(e) => setEditingProgram({...editingProgram, active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">활성화</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                제공 서비스 (쉼표로 구분)
              </label>
              <textarea
                value={editingProgram.description}
                onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="예: 기본 운동기구 이용, PCU 시스템 이용, 샤워시설 이용"
                required
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                수정 완료
              </button>
            </div>
          </form>
        )}

        {/* 멤버십 목록 */}
        <div className="space-y-4">
          {tempPaymentSettings.programs.map((program) => (
            <div 
              key={program.id} 
              className={`border rounded-lg p-4 ${
                editingProgram && editingProgram.id === program.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {program.active ? '활성' : '비활성'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{program.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>가격: {program.price.toLocaleString()}원</span>
                    <span>기간: {program.duration}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProgram(program)}
                    disabled={editingProgram !== null && editingProgram.id !== program.id}
                    className={`px-3 py-1 rounded text-sm ${
                      editingProgram !== null && editingProgram.id !== program.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      const updatedPrograms = tempPaymentSettings.programs.map(p => 
                        p.id === program.id ? {...p, active: !p.active} : p
                      )
                      const updatedSettings = {
                        ...tempPaymentSettings,
                        programs: updatedPrograms
                      }
                      setTempPaymentSettings(updatedSettings)
                      setPaymentSettings(updatedSettings)
                      localStorage.setItem('paymentSettings', JSON.stringify(updatedSettings))
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      program.active 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {program.active ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(program.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = localStorage.getItem('reservations')
    return savedReservations ? JSON.parse(savedReservations) : [
      {
        id: 1,
        time: '09:00',
        date: '2024-01-20',
        customerName: '김민수',
        customerPhone: '010-1234-5678',
        program: '자세교정',
        trainer: '김트레이너',
        status: 'confirmed'
      },
      {
        id: 2,
        time: '16:00',
        date: '2024-01-20',
        customerName: '정미영',
        customerPhone: '010-2345-6789',
        program: '산후관리',
        trainer: '박트레이너',
        status: 'pending'
      }
    ]
  })

  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('members')
    return savedMembers ? JSON.parse(savedMembers) : [
      {
        id: 1,
        name: '김민수',
        phone: '010-1234-5678',
        email: 'kim@email.com',
        program: '자세교정',
        joinDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 2,
        name: '정미영',
        phone: '010-2345-6789',
        email: 'jung@email.com',
        program: '산후관리',
        joinDate: '2024-01-05',
        status: 'active'
      }
    ]
  })

  const [reviews, setReviews] = useState<Review[]>(() => {
    const savedReviews = localStorage.getItem('reviews')
    return savedReviews ? JSON.parse(savedReviews) : [
      {
        id: 1,
        name: '김사라',
        program: '자세교정',
        rating: 5,
        content: 'AI 분석이 정말 놀라웠어요! 2개월 만에 자세가 극적으로 개선되었습니다.',
        date: '2024-01-15',
        status: 'approved'
      },
      {
        id: 2,
        name: '박민수',
        program: '벌크업',
        rating: 5,
        content: '건강을 위한 최고의 투자였습니다. 개인 맞춤 프로그램이 정말 효과적이에요.',
        date: '2024-01-10',
        status: 'pending'
      }
    ]
  })

  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const savedPortfolios = localStorage.getItem('portfolios')
    return savedPortfolios ? JSON.parse(savedPortfolios) : [
      {
        id: 1,
        title: "김민지님의 다이어트 성공 스토리",
        description: "6개월간의 체계적인 다이어트 프로그램을 통해 15kg 감량에 성공하셨습니다. AI 자세 분석과 개인 맞춤 운동으로 건강하게 목표를 달성했습니다.",
        beforeImage: "/api/placeholder/300/400",
        afterImage: "/api/placeholder/300/400",
        program: "다이어트",
        duration: "6개월",
        results: ["15kg 감량", "체지방률 12% 감소", "근육량 유지"],
        date: "2024-01-15",
        imageUrl: "/api/placeholder/300/400",
        category: "다이어트"
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
        date: "2024-01-10",
        imageUrl: "/api/placeholder/300/400",
        category: "벌크업"
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
        date: "2024-01-05",
        imageUrl: "/api/placeholder/300/400",
        category: "자세교정"
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
        date: "2024-01-01",
        imageUrl: "/api/placeholder/300/400",
        category: "산후관리"
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
        date: "2023-12-25",
        imageUrl: "/api/placeholder/300/400",
        category: "웨딩 PT"
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
        date: "2023-12-20",
        imageUrl: "/api/placeholder/300/400",
        category: "재활운동"
      }
    ]
  })

  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [todayReservations, setTodayReservations] = useState(0)

  useEffect(() => {
    // Load base stats from localStorage if exists
    const savedStats = localStorage.getItem('baseStats')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setBaseStats(stats)
      setTempBaseStats(stats)
    }
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayCount = reservations.filter(r => r.date === today).length
    setTodayReservations(todayCount)
  }, [reservations])

  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios))
  }, [portfolios])

  const updateBaseStats = (field: keyof typeof baseStats, value: number) => {
    const newStats = { ...baseStats, [field]: value }
    setBaseStats(newStats)
    localStorage.setItem('baseStats', JSON.stringify(newStats))
  }

  const updateTempBaseStats = (field: keyof typeof baseStats, value: number) => {
    setTempBaseStats(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveBaseStats = () => {
    setBaseStats(tempBaseStats)
    localStorage.setItem('baseStats', JSON.stringify(tempBaseStats))
    // 다른 탭에서 변경을 감지할 수 있도록 storage 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'baseStats',
      newValue: JSON.stringify(tempBaseStats),
      storageArea: localStorage
    }))
  }

  const getTotalReservations = () => {
    return baseStats.totalReservations + reservations.length
  }

  const getTotalRegistered = () => {
    return baseStats.totalRegistered + members.length
  }

  const updateReservationStatus = (id: number, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    setReservations(prev => 
      prev.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      )
    )
    
    // 로컬 스토리지에 저장
    const updatedReservations = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    )
    localStorage.setItem('reservations', JSON.stringify(updatedReservations))
  }

  const updateMemberStatus = (id: number, newStatus: 'active' | 'inactive') => {
    setMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, status: newStatus } : member
      )
    )
    
    // 로컬 스토리지에 저장
    const updatedMembers = members.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    )
    localStorage.setItem('members', JSON.stringify(updatedMembers))
  }

  const updateReviewStatus = (id: number, newStatus: 'approved' | 'pending' | 'rejected') => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id ? { ...review, status: newStatus } : review
      )
    )
    
    // 로컬 스토리지에 저장
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, status: newStatus } : review
    )
    localStorage.setItem('reviews', JSON.stringify(updatedReviews))
  }

  const deleteMember = (id: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      setMembers(prev => prev.filter(m => m.id !== id))
      const updatedMembers = members.filter(m => m.id !== id)
      localStorage.setItem('members', JSON.stringify(updatedMembers))
    }
  }

  const deleteReview = (id: number) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      setReviews(prev => prev.filter(r => r.id !== id))
      const updatedReviews = reviews.filter(r => r.id !== id)
      localStorage.setItem('reviews', JSON.stringify(updatedReviews))
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    }
    const texts = {
      confirmed: '확정',
      pending: '대기중',
      cancelled: '취소됨',
      approved: '승인됨',
      active: '활성',
      inactive: '비활성'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {texts[status as keyof typeof texts] || status}
      </span>
    )
  }

  const handlePortfolioImage = async (file: File): Promise<string | null> => {
    if (!file) return null
    
    // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다.
    // 여기서는 임시로 로컬 URL을 생성합니다.
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const addPortfolio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const beforeImageFile = (form.beforeImage as HTMLInputElement).files?.[0]
    const afterImageFile = (form.afterImage as HTMLInputElement).files?.[0]
    
    const beforeImageUrl = beforeImageFile ? await handlePortfolioImage(beforeImageFile) : null
    const afterImageUrl = afterImageFile ? await handlePortfolioImage(afterImageFile) : null
    
    const newPortfolio: Portfolio = {
      id: Date.now(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      program: formData.get('program') as string,
      duration: formData.get('duration') as string,
      results: (formData.get('results') as string).split(',').map(s => s.trim()),
      beforeImage: beforeImageUrl || '/portfolio/default.jpg',
      afterImage: afterImageUrl || '/portfolio/default.jpg',
      imageUrl: beforeImageUrl || '/portfolio/default.jpg', // 대표 이미지로 before 이미지 사용
      category: formData.get('program') as string, // 프로그램을 카테고리로 사용
      date: new Date().toISOString().split('T')[0]
    }

    setPortfolios(prev => [...prev, newPortfolio])
    form.reset()
  }

  const updatePortfolio = async (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const beforeImageFile = (form.beforeImage as HTMLInputElement).files?.[0]
    const afterImageFile = (form.afterImage as HTMLInputElement).files?.[0]
    
    let beforeImageUrl = null
    let afterImageUrl = null
    
    if (beforeImageFile) {
      beforeImageUrl = await handlePortfolioImage(beforeImageFile)
    }
    if (afterImageFile) {
      afterImageUrl = await handlePortfolioImage(afterImageFile)
    }

    setPortfolios(prev => prev.map(p => {
      if (p.id === id) {
        const updatedPortfolio = {
          ...p,
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          program: formData.get('program') as string,
          duration: formData.get('duration') as string,
          results: (formData.get('results') as string).split(',').map(s => s.trim()),
          category: formData.get('program') as string
        }

        if (beforeImageUrl) {
          updatedPortfolio.beforeImage = beforeImageUrl
          updatedPortfolio.imageUrl = beforeImageUrl // 대표 이미지 업데이트
        }
        if (afterImageUrl) {
          updatedPortfolio.afterImage = afterImageUrl
        }

        return updatedPortfolio
      }
      return p
    }))
    setEditingPortfolio(null)
  }

  const deletePortfolio = (id: number) => {
    if (window.confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
      setPortfolios(prev => prev.filter(p => p.id !== id))
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">기본 통계 설정</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기본 총 예약수
            </label>
            <input
              type="number"
              value={tempBaseStats.totalReservations}
              onChange={(e) => 
                setTempBaseStats({
                  ...tempBaseStats,
                  totalReservations: parseInt(e.target.value) || 0
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기본 총 등록수
            </label>
            <input
              type="number"
              value={tempBaseStats.totalRegistered}
              onChange={(e) =>
                setTempBaseStats({
                  ...tempBaseStats,
                  totalRegistered: parseInt(e.target.value) || 0
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={saveBaseStats}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘의 예약</h3>
          <p className="text-3xl font-bold text-blue-600">{todayReservations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 예약</h3>
          <p className="text-3xl font-bold text-purple-600">{baseStats.totalReservations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 등록수</h3>
          <p className="text-3xl font-bold text-indigo-600">{baseStats.totalRegistered}</p>
        </div>
      </div>
    </div>
  )

  const renderReservations = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">예약 관리</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜/시간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객정보</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">프로그램</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">트레이너</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reservation.date}</div>
                    <div className="text-sm text-gray-500">{reservation.time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                    <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.trainer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(reservation.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        취소
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderMembers = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">회원 관리</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원정보</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">프로그램</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(member.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => updateMemberStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                    className={`text-${member.status === 'active' ? 'yellow' : 'green'}-600 hover:text-${member.status === 'active' ? 'yellow' : 'green'}-900`}
                  >
                    {member.status === 'active' ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">리뷰 관리</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">프로그램</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평점</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">내용</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map(review => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {review.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {review.rating}/5
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs overflow-hidden text-ellipsis">
                    {review.content}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(review.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        거절
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPortfolioForm = (portfolio: Portfolio | null = null) => (
    <form onSubmit={portfolio ? (e: FormEvent<HTMLFormElement>) => updatePortfolio(e, portfolio.id) : addPortfolio} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
        <input
          type="text"
          name="title"
          defaultValue={portfolio?.title}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
        <textarea
          name="description"
          defaultValue={portfolio?.description}
          required
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프로그램</label>
        <select
          name="program"
          defaultValue={portfolio?.program}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="다이어트">다이어트</option>
          <option value="벌크업">벌크업</option>
          <option value="자세교정">자세교정</option>
          <option value="산후관리">산후관리</option>
          <option value="웨딩 PT">웨딩 PT</option>
          <option value="재활운동">재활운동</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
        <input
          type="text"
          name="duration"
          defaultValue={portfolio?.duration}
          required
          placeholder="예: 3개월"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Before 이미지</label>
        <input
          type="file"
          name="beforeImage"
          accept="image/*"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">After 이미지</label>
        <input
          type="file"
          name="afterImage"
          accept="image/*"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">주요 성과 (쉼표로 구분)</label>
        <input
          type="text"
          name="results"
          defaultValue={portfolio?.results.join(', ')}
          required
          placeholder="예: 체중 15kg 감량, 체지방률 10% 감소"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end space-x-2">
        {portfolio && (
          <button
            type="button"
            onClick={() => setEditingPortfolio(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {portfolio ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">새 포트폴리오 추가</h3>
        {renderPortfolioForm()}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">포트폴리오 관리</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map(portfolio => (
              <div key={portfolio.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={portfolio.imageUrl}
                    alt={portfolio.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                {editingPortfolio?.id === portfolio.id ? (
                  <div className="p-4">
                    {renderPortfolioForm(portfolio)}
                  </div>
                ) : (
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{portfolio.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{portfolio.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{portfolio.category}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => setEditingPortfolio(portfolio)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deletePortfolio(portfolio.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderBanner = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>
      
      {/* 배너 설정 섹션 */}
      <BannerSettingsSection />

      {/* 배너 관리 섹션 */}
      <BannerManagementSection />
    </div>
  )

  const renderPayment = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">결제 설정</h1>
      
      {/* 결제 설정 섹션 */}
      <PaymentSettingsSection />

      {/* 결제 프로그램 관리 섹션 */}
      <PaymentProgramsSection />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <a 
                href="/"
                className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                인피니티짐
              </a>
              <span className="text-gray-300">|</span>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                홈으로
              </a>
              <span className="text-sm text-gray-500">관리자님, 안녕하세요!</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminLoggedIn')
                  localStorage.removeItem('adminUser')
                  router.push('/')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: '대시보드' },
              { id: 'banner', name: '배너 관리' },
              { id: 'payment', name: '결제 설정' },
              { id: 'reservations', name: '예약 관리' },
              { id: 'members', name: '회원 관리' },
              { id: 'reviews', name: '리뷰 관리' },
              { id: 'portfolio', name: '포트폴리오 관리' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            {/* 대시보드 액션 버튼 */}
            {activeTab === 'dashboard' && (
              <>
                <button
                  onClick={() => alert('데이터를 새로고침합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  새로고침
                </button>
                <button
                  onClick={() => alert('일일 리포트를 다운로드합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  일일 리포트
                </button>
              </>
            )}
            
            {/* 예약 관리 액션 버튼 */}
            {activeTab === 'reservations' && (
              <>
                <button
                  onClick={() => alert('새 예약을 추가합니다.')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  새 예약
                </button>
                <button
                  onClick={() => alert('예약 목록을 엑셀로 내보냅니다.')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  엑셀 내보내기
                </button>
              </>
            )}

            {/* 회원 관리 액션 버튼 */}
            {activeTab === 'members' && (
              <>
                <button
                  onClick={() => alert('새 회원을 등록합니다.')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  회원 등록
                </button>
                <button
                  onClick={() => alert('회원 목록을 엑셀로 내보냅니다.')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  엑셀 내보내기
                </button>
                <button
                  onClick={() => alert('대량 메일을 발송합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  대량 메일 발송
                </button>
              </>
            )}

            {/* 리뷰 관리 액션 버튼 */}
            {activeTab === 'reviews' && (
              <>
                <button
                  onClick={() => alert('모든 대기 중인 리뷰를 승인합니다.')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  일괄 승인
                </button>
                <button
                  onClick={() => alert('리뷰 통계를 내보냅니다.')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  통계 보기
                </button>
              </>
            )}

            {/* 결제 설정 액션 버튼 */}
            {activeTab === 'payment' && (
              <>
                <button
                  onClick={() => alert('결제 설정을 초기화합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  설정 초기화
                </button>
                <button
                  onClick={() => alert('결제 통계를 확인합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  결제 통계
                </button>
              </>
            )}

            {/* 포트폴리오 관리 액션 버튼 */}
            {activeTab === 'portfolio' && (
              <>
                <button
                  onClick={() => alert('새 포트폴리오를 추가합니다.')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  새 포트폴리오
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'banner' && renderBanner()}
        {activeTab === 'payment' && renderPayment()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'portfolio' && renderPortfolio()}
      </div>
    </div>
  )
} 