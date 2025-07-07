'use client'

import dynamic from 'next/dynamic'

// AdminContent를 클라이언트 사이드에서만 로드하도록 설정
const AdminContent = dynamic(() => import('./AdminContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
})

export default function AdminPage() {
  return <AdminContent />
} 