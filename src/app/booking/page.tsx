'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BookingPage() {
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [minDate, setMinDate] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    setMinDate(today)
  }, [])

  const programs = [
    '재활운동', '자세교정', '다이어트', '벌크업', '산후관리', '웨딩 PT'
  ]

  // 예약 통계 데이터 (실제로는 API에서 가져올 데이터)
  const bookingStats = {
    totalBookings: 156,
    thisMonthBookings: 24,
    thisWeekBookings: 8,
    todayBookings: 3,
    programDistribution: [
      { name: '재활운동', count: 32, percentage: 20.5 },
      { name: '자세교정', count: 45, percentage: 28.8 },
      { name: '다이어트', count: 38, percentage: 24.4 },
      { name: '벌크업', count: 15, percentage: 9.6 },
      { name: '산후관리', count: 18, percentage: 11.5 },
      { name: '웨딩 PT', count: 8, percentage: 5.2 }
    ]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProgram || !selectedDate || !selectedTime) {
      alert('모든 필드를 선택해주세요.')
      return
    }
    alert('예약이 성공적으로 완료되었습니다!')
  }

  const getRandomColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              예약하기
            </h1>
            <p className="text-xl text-gray-600">
              원하는 프로그램을 선택하고 예약하세요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 예약 통계 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">예약 현황</h2>
              
              {/* 통계 카드 */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">전체 예약</p>
                  <p className="text-2xl font-bold text-blue-700">{bookingStats.totalBookings}건</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">이번 달</p>
                  <p className="text-2xl font-bold text-green-700">{bookingStats.thisMonthBookings}건</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 mb-1">이번 주</p>
                  <p className="text-2xl font-bold text-yellow-700">{bookingStats.thisWeekBookings}건</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">오늘</p>
                  <p className="text-2xl font-bold text-purple-700">{bookingStats.todayBookings}건</p>
                </div>
              </div>

              {/* 프로그램별 분포 */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">프로그램별 예약 분포</h3>
              <div className="space-y-4">
                {bookingStats.programDistribution.map((program, index) => (
                  <div key={program.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{program.name}</span>
                      <span className="text-gray-900 font-medium">{program.count}건 ({program.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getRandomColor(index)}`}
                        style={{ width: `${program.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 예약하기 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">세션 예약하기</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 프로그램 선택 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    프로그램 선택
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">프로그램을 선택해주세요</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>

                {/* 날짜 선택 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    날짜 선택
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={minDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 시간 선택 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    시간 선택
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">시간을 선택해주세요</option>
                    {Array.from({ length: 12 }, (_, i) => i + 9).map(hour => (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    ))}
                  </select>
                </div>

                {/* 예약 버튼 */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  예약하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 