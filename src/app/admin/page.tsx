'use client'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminContent from './AdminContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { checkAdminAuth } from './auth'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    if (!checkAdminAuth()) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Suspense fallback={
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              {/* 대시보드 카드 스켈레톤 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
              
              {/* 예약 현황 스켈레톤 */}
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <AdminContent />
      </Suspense>
      <Footer />
    </div>
  )
} 