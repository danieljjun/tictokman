'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  // 클라이언트 hydration 완료 후 localStorage 확인
  useEffect(() => {
    // hydration 완료 표시
    setIsHydrated(true)
    
    const checkLoginStatus = () => {
      try {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn')
        const adminUser = localStorage.getItem('adminUser')
        
        if (adminLoggedIn === 'true' && adminUser) {
          setIsLoggedIn(true)
          setUserEmail(adminUser)
        } else {
          setIsLoggedIn(false)
          setUserEmail('')
        }
      } catch (error) {
        setIsLoggedIn(false)
        setUserEmail('')
      }
    }

    checkLoginStatus()

    // localStorage 변경 감지
    window.addEventListener('storage', checkLoginStatus)
    window.addEventListener('loginStatusChanged', checkLoginStatus)
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('loginStatusChanged', checkLoginStatus)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
    setUserEmail('')
    // 로그인 상태 변경 알림
    window.dispatchEvent(new Event('loginStatusChanged'))
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              인피니티짐
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/portfolio" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              포트폴리오
            </a>
            <a href="/reviews" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              후기
            </a>
            <a href="/booking" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              예약
            </a>
            <a href="/payment" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              결제
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isHydrated || !isLoggedIn ? (
              // 서버 렌더링 시 또는 로그아웃 상태
              <>
                <a href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                  로그인
                </a>
                <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  회원가입
                </a>
              </>
            ) : (
              // 클라이언트 hydration 완료 후 로그인 상태
              <>
                <span className="text-sm text-gray-600">
                  안녕하세요, <span className="font-semibold text-gray-900">{userEmail}</span>님
                </span>
                <a href="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                  관리자
                </a>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a href="/portfolio" className="block text-gray-600 hover:text-gray-900 px-3 py-2">포트폴리오</a>
              <a href="/reviews" className="block text-gray-600 hover:text-gray-900 px-3 py-2">후기</a>
              <a href="/booking" className="block text-gray-600 hover:text-gray-900 px-3 py-2">예약</a>
              <a href="/payment" className="block text-gray-600 hover:text-gray-900 px-3 py-2">결제</a>
              <div className="border-t pt-4 mt-4">
                {!isHydrated || !isLoggedIn ? (
                  // 서버 렌더링 시 또는 로그아웃 상태
                  <>
                    <a href="/login" className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2">
                      로그인
                    </a>
                    <a href="/signup" className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 mt-2">
                      회원가입
                    </a>
                  </>
                ) : (
                  // 클라이언트 hydration 완료 후 로그인 상태
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      안녕하세요, <span className="font-semibold text-gray-900">{userEmail}</span>님
                    </div>
                    <a href="/admin" className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2">
                      관리자
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 mt-2"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 