'use client'

import { useState, useEffect } from 'react'

interface BaseStats {
  totalReservations: number
  totalRegistered: number
}

export default function BookingStatusSection() {
  const [reservations, setReservations] = useState([])
  const [baseStats, setBaseStats] = useState<BaseStats>({
    totalReservations: 0,
    totalRegistered: 0
  })

  useEffect(() => {
    // localStorage에서 데이터 로드
    const loadData = () => {
      // 예약 데이터 로드
      const savedReservations = localStorage.getItem('reservations')
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations))
      }

      // 기본 통계 데이터 로드
      const savedStats = localStorage.getItem('baseStats')
      if (savedStats) {
        const stats = JSON.parse(savedStats)
        setBaseStats(stats)
      }
    }

    // 초기 로드
    loadData()

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reservations' || e.key === 'baseStats') {
        loadData()
      }
    }

    // 같은 탭에서의 변경 감지
    const handleLocalStorageChange = () => {
      loadData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleLocalStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleLocalStorageChange)
    }
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">실시간 예약 현황</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">총 예약</h3>
              <p className="text-5xl font-bold text-purple-600">{baseStats.totalReservations}</p>
            </div>
          </div>
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">총 등록수</h3>
              <p className="text-5xl font-bold text-indigo-600">{baseStats.totalRegistered}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 