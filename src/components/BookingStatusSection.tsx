'use client'

import { useState, useEffect } from 'react'

export default function BookingStatusSection() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      time: '09:00',
      date: '2024-01-20',
      customerName: '김민수',
      program: '자세교정',
      trainer: '김트레이너',
      status: 'confirmed'
    },
    {
      id: 2,
      time: '16:00',
      date: '2024-01-20',
      customerName: '정미영',
      program: '산후관리',
      trainer: '박트레이너',
      status: 'pending'
    }
  ])

  const [totalRegistered, setTotalRegistered] = useState(150)
  const [todayReservations, setTodayReservations] = useState(0)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayCount = reservations.filter(r => r.date === today).length
    setTodayReservations(todayCount)
  }, [reservations])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">실시간 예약 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 예약</h3>
            <p className="text-3xl font-bold text-purple-600">{reservations.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 등록수</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalRegistered}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘 예약</h3>
            <p className="text-3xl font-bold text-blue-600">{todayReservations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">확정된 예약</h3>
            <p className="text-3xl font-bold text-green-600">
              {reservations.filter(r => r.status === 'confirmed').length}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 