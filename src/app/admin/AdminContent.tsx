'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { settingsManager } from '@/utils/settings'

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

const BANNER_STORAGE_KEY = 'bannerData'

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

  const [bannerImage, setBannerImage] = useState<string>('/uploads/images/default-banner.jpg')
  const [bannerText, setBannerText] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    // 초기 데이터 로드
    const savedBanner = settingsManager.get(BANNER_STORAGE_KEY, {
      image: '/uploads/images/default-banner.jpg',
      text: ''
    })
    
    setBannerImage(savedBanner.image)
    setBannerText(savedBanner.text)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        setMessage('파일 크기는 10MB를 초과할 수 없습니다.')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const newImageUrl = data.url

      // 데이터 저장 및 동기화
      settingsManager.set(BANNER_STORAGE_KEY, {
        image: newImageUrl,
        text: bannerText
      })

      setBannerImage(newImageUrl)
      setMessage('이미지가 성공적으로 업로드되었습니다.')
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setBannerText(newText)
    
    // 데이터 저장 및 동기화
    settingsManager.set(BANNER_STORAGE_KEY, {
      image: bannerImage,
      text: newText
    })
  }

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = settingsManager.get('reservations', [
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
    ])
    return savedReservations
  })

  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = settingsManager.get('members', [
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
    ])
    return savedMembers
  })

  const [reviews, setReviews] = useState<Review[]>(() => {
    const savedReviews = settingsManager.get('reviews', [
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
    ])
    return savedReviews
  })

  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const savedPortfolios = settingsManager.get('portfolios', [
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
    ])
    return savedPortfolios
  })

  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [todayReservations, setTodayReservations] = useState(0)

  useEffect(() => {
    // Load base stats from localStorage if exists
    const savedStats = settingsManager.get('baseStats', {
      totalReservations: 0,
      totalRegistered: 0
    })
    setBaseStats(savedStats)
    setTempBaseStats(savedStats)
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayCount = reservations.filter(r => r.date === today).length
    setTodayReservations(todayCount)
  }, [reservations])

  useEffect(() => {
    settingsManager.set('portfolios', portfolios)
  }, [portfolios])

  const updateBaseStats = (field: keyof typeof baseStats, value: number) => {
    const newStats = { ...baseStats, [field]: value }
    setBaseStats(newStats)
    settingsManager.set('baseStats', newStats)
  }

  const updateTempBaseStats = (field: keyof typeof baseStats, value: number) => {
    setTempBaseStats(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveBaseStats = () => {
    setBaseStats(tempBaseStats)
    settingsManager.set('baseStats', tempBaseStats)
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
    settingsManager.set('reservations', updatedReservations)
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
    settingsManager.set('members', updatedMembers)
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
    settingsManager.set('reviews', updatedReviews)
  }

  const deleteMember = (id: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      setMembers(prev => prev.filter(m => m.id !== id))
      const updatedMembers = members.filter(m => m.id !== id)
      settingsManager.set('members', updatedMembers)
    }
  }

  const deleteReview = (id: number) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      setReviews(prev => prev.filter(r => r.id !== id))
      const updatedReviews = reviews.filter(r => r.id !== id)
      settingsManager.set('reviews', updatedReviews)
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

    const beforeImageFile = (form.querySelector('#beforeImage') as HTMLInputElement).files?.[0]
    const afterImageFile = (form.querySelector('#afterImage') as HTMLInputElement).files?.[0]

    try {
      let beforeImageUrl = null
      let afterImageUrl = null

      if (beforeImageFile) {
        beforeImageUrl = await handlePortfolioImage(beforeImageFile)
      }
      if (afterImageFile) {
        afterImageUrl = await handlePortfolioImage(afterImageFile)
      }

      if (!beforeImageUrl || !afterImageUrl) {
        setMessage('이미지 업로드에 실패했습니다.')
        return
      }

      const newPortfolio = {
        id: Date.now(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        program: formData.get('program') as string,
        duration: formData.get('duration') as string,
        results: (formData.get('results') as string).split('\n').filter(Boolean),
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
        date: new Date().toISOString()
      }

      const existingPortfolios = await settingsManager.get('portfolios', [])
      await settingsManager.set('portfolios', [...existingPortfolios, newPortfolio])
      
      form.reset()
      setMessage('포트폴리오가 성공적으로 추가되었습니다.')
    } catch (error) {
      console.error('Portfolio add error:', error)
      setMessage('포트폴리오 추가 중 오류가 발생했습니다.')
    }
  }

  const updatePortfolio = async (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const beforeImageFile = (form.querySelector('#beforeImage') as HTMLInputElement).files?.[0]
    const afterImageFile = (form.querySelector('#afterImage') as HTMLInputElement).files?.[0]

    try {
      const existingPortfolios = await settingsManager.get('portfolios', [])
      const portfolioIndex = existingPortfolios.findIndex((p: Portfolio) => p.id === id)
      
      if (portfolioIndex === -1) {
        setMessage('포트폴리오를 찾을 수 없습니다.')
        return
      }

      let beforeImageUrl = existingPortfolios[portfolioIndex].beforeImage
      let afterImageUrl = existingPortfolios[portfolioIndex].afterImage

      if (beforeImageFile) {
        const newBeforeImageUrl = await handlePortfolioImage(beforeImageFile)
        if (newBeforeImageUrl) beforeImageUrl = newBeforeImageUrl
      }
      if (afterImageFile) {
        const newAfterImageUrl = await handlePortfolioImage(afterImageFile)
        if (newAfterImageUrl) afterImageUrl = newAfterImageUrl
      }

      const updatedPortfolio = {
        ...existingPortfolios[portfolioIndex],
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        program: formData.get('program') as string,
        duration: formData.get('duration') as string,
        results: (formData.get('results') as string).split('\n').filter(Boolean),
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
      }

      existingPortfolios[portfolioIndex] = updatedPortfolio
      await settingsManager.set('portfolios', existingPortfolios)
      
      setMessage('포트폴리오가 성공적으로 업데이트되었습니다.')
    } catch (error) {
      console.error('Portfolio update error:', error)
      setMessage('포트폴리오 업데이트 중 오류가 발생했습니다.')
    }
  }

  const deletePortfolio = async (id: number) => {
    try {
      const existingPortfolios = await settingsManager.get('portfolios', [])
      const updatedPortfolios = existingPortfolios.filter((p: Portfolio) => p.id !== id)
      await settingsManager.set('portfolios', updatedPortfolios)
      setMessage('포트폴리오가 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('Portfolio delete error:', error)
      setMessage('포트폴리오 삭제 중 오류가 발생했습니다.')
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
          id="beforeImage"
          accept="image/*"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">After 이미지</label>
        <input
          type="file"
          name="afterImage"
          id="afterImage"
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