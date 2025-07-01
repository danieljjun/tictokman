'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: '',
    goals: [] as string[],
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  })
  const [showPassword, setShowPassword] = useState(false)

  const fitnessGoals = [
    '체중 감량', '근육 증가', '체력 향상', '자세 교정', '재활', '건강 관리'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!formData.name || !formData.email || !formData.password) {
      alert('필수 정보를 모두 입력해주세요.')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('필수 약관에 동의해주세요.')
      return
    }
    
    // 실제 구현에서는 API 호출
    console.log('회원가입 데이터:', formData)
    alert('회원가입이 성공적으로 완료되었습니다!')
    
    // 로그인 페이지로 이동
    window.location.href = '/login'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
              <p className="text-gray-600">인피니티짐과 함께 건강한 여정을 시작하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름을 입력해주세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      이메일 *
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      비밀번호 *
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      비밀번호 확인 *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="비밀번호를 다시 입력해주세요"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="연락처를 입력해주세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      생년월일
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    성별
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>

              {/* 운동 목표 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">운동 목표 (복수 선택 가능)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {fitnessGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.goals.includes(goal)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">약관 동의</h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-sm">
                      <span className="text-red-500">*</span> 이용약관에 동의합니다
                      <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">[보기]</a>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-sm">
                      <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                      <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">[보기]</a>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </span>
                  </label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                회원가입
              </button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 회원이신가요?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 