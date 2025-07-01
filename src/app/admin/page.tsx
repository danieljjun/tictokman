'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reservations, setReservations] = useState([
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
    },
    {
      id: 3,
      time: '18:00',
      date: '2024-01-20',
      customerName: '최현우',
      customerPhone: '010-3456-7890',
      program: '웨딩 PT',
      trainer: '최트레이너',
      status: 'confirmed'
    }
  ])

  const [members, setMembers] = useState([
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
    },
    {
      id: 3,
      name: '최현우',
      phone: '010-3456-7890',
      email: 'choi@email.com',
      program: '웨딩 PT',
      joinDate: '2024-01-10',
      status: 'active'
    }
  ])

  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: '체형 교정 성공 사례',
      category: '자세교정',
      beforeImage: '/portfolio/before1.jpg',
      afterImage: '/portfolio/after1.jpg',
      description: '3개월 간의 자세 교정 프로그램 진행 결과',
      trainer: '김트레이너',
      date: '2024-01-15',
      status: 'published'
    },
    {
      id: 2,
      title: '다이어트 성공 사례',
      category: '다이어트',
      beforeImage: '/portfolio/before2.jpg',
      afterImage: '/portfolio/after2.jpg',
      description: '6개월 간 -15kg 감량 성공',
      trainer: '박트레이너',
      date: '2024-01-10',
      status: 'draft'
    }
  ])

  const [reviews, setReviews] = useState([
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

  const updateReservationStatus = (id: number, newStatus: string) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      )
    )
  }

  const updateReviewStatus = (id: number, newStatus: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id ? { ...review, status: newStatus } : review
      )
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      approved: 'bg-blue-100 text-blue-800'
    }
    const texts = {
      confirmed: '확정',
      pending: '대기중',
      cancelled: '취소됨',
      approved: '승인됨'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {texts[status as keyof typeof texts] || status}
      </span>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘 예약</h3>
          <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">대기 중</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 회원</h3>
          <p className="text-3xl font-bold text-green-600">{members.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">신규 리뷰</h3>
          <p className="text-3xl font-bold text-purple-600">
            {reviews.filter(r => r.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">오늘의 예약 현황</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reservations.map(reservation => (
              <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{reservation.time} - {reservation.customerName}</p>
                  <p className="text-sm text-gray-600">{reservation.program} | {reservation.trainer}</p>
                </div>
                {getStatusBadge(reservation.status)}
              </div>
            ))}
          </div>
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
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      className="text-red-600 hover:text-red-900"
                    >
                      취소
                    </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">프로그램</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    활성
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPortfolio = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    return (
      <div className="space-y-6">
        {/* 포트폴리오 업로드 폼 */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">새 포트폴리오 업로드</h3>
          </div>
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="포트폴리오 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">카테고리 선택</option>
                    <option value="자세교정">자세교정</option>
                    <option value="다이어트">다이어트</option>
                    <option value="벌크업">벌크업</option>
                    <option value="재활운동">재활운동</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Before 이미지
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>이미지 업로드</span>
                          <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    After 이미지
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>이미지 업로드</span>
                          <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="포트폴리오에 대한 설명을 입력하세요"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    담당 트레이너
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">트레이너 선택</option>
                    <option value="김트레이너">김트레이너</option>
                    <option value="박트레이너">박트레이너</option>
                    <option value="이트레이너">이트레이너</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    상태
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="draft">임시저장</option>
                    <option value="published">공개</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  업로드
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 포트폴리오 목록 */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">포트폴리오 목록</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioItems.map(item => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.category} • {item.trainer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'published' ? '공개' : '임시저장'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before</p>
                        <img 
                          src={item.beforeImage} 
                          alt="Before" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">After</p>
                        <img 
                          src={item.afterImage} 
                          alt="After" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{item.date}</span>
                      <div className="space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">수정</button>
                        <button className="text-red-600 hover:text-red-800">삭제</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderReviews = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">리뷰 관리</h3>
      </div>
      <div className="p-6 space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                <p className="text-sm text-gray-600">{review.program} • {review.date}</p>
                <div className="flex mt-1">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(review.status)}
                {review.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      거부
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
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
                  window.location.href = '/'
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
              { id: 'reservations', name: '예약 관리' },
              { id: 'members', name: '회원 관리' },
              { id: 'reviews', name: '리뷰 관리' },
              { id: 'portfolio', name: '포트폴리오' }
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
                <button
                  onClick={() => alert('포트폴리오를 정렬합니다.')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  정렬
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'portfolio' && renderPortfolio()}
      </div>
    </div>
  )
} 