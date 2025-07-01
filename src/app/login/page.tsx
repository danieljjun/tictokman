'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }
    
    // 관리자 계정 확인 (실제로는 서버에서 검증)
    if (formData.email === 'admin@infinitygym.com' && formData.password === 'admin123') {
      // 로그인 상태 저장
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminUser', formData.email)
      
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'))
      
      alert('관리자로 로그인되었습니다!')
      window.location.href = '/admin'
    } else if (formData.email && formData.password) {
      // 일반 사용자 로그인
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminUser', formData.email)
      
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'))
      
      alert('로그인이 성공적으로 완료되었습니다!')
      window.location.href = '/'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
              <p className="text-gray-600">인피니티짐에 오신 것을 환영합니다</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일을 입력해주세요"
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="비밀번호를 입력해주세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* 로그인 옵션 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  비밀번호 찾기
                </a>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                로그인
              </button>
            </form>

            {/* 소셜 로그인 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="mr-2">📘</span>
                  Facebook
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="mr-2">🔍</span>
                  Google
                </button>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                아직 회원이 아니신가요?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                  회원가입
                </Link>
              </p>
            </div>
          </div>

          {/* 테스트 계정 안내 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">🔧 테스트 계정</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>관리자:</strong> admin@infinitygym.com / admin123</p>
              <p><strong>일반 사용자:</strong> 아무 이메일/비밀번호</p>
            </div>
          </div>

          {/* 게스트 로그인 */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              게스트로 둘러보기 →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 