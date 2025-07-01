'use client'

import { useState, useEffect } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const plans = [
    {
      id: 'basic',
      name: '기본 멤버십',
      price: 150000,
      duration: '1개월',
      features: ['기본 운동기구 이용', 'PCU 시스템 이용', '샤워시설 이용']
    },
    {
      id: 'premium',
      name: '프리미엄 멤버십',
      price: 400000,
      duration: '3개월',
      features: ['모든 운동기구 이용', 'AI 분석 시스템', '개인 트레이너 월 2회', '영양 상담']
    },
    {
      id: 'vip',
      name: 'VIP 멤버십',
      price: 800000,
      duration: '6개월',
      features: ['모든 시설 무제한', 'AI 분석 시스템', '개인 트레이너 주 2회', '영양 상담', '마사지 서비스']
    },
    {
      id: 'pt',
      name: '개인 PT 세션',
      price: 80000,
      duration: '1회',
      features: ['1:1 개인 트레이닝', 'AI 자세 분석', '운동 프로그램 설계']
    }
  ]

  const handlePayment = async () => {
    if (!selectedPlan || !customerInfo.name || !customerInfo.email) {
      alert('모든 필수 정보를 입력해주세요.')
      return
    }

    const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
    if (!selectedPlanData) return

    try {
      const tossPayments = await loadTossPayments('test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq') // 테스트 키

      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: selectedPlanData.price,
        orderId: `infinitygym_${Date.now()}`,
        orderName: selectedPlanData.name,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (error) {
      console.error('결제 에러:', error)
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              멤버십 결제
            </h1>
            <p className="text-xl text-gray-600">
              인피니티짐에서 최고의 운동 경험을 시작하세요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 멤버십 선택 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">멤버십 선택</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {plan.price.toLocaleString()}원
                        </div>
                        <div className="text-sm text-gray-500">{plan.duration}</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 정보</h2>
              
              {/* 고객 정보 */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="성함을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="연락처를 입력해주세요"
                  />
                </div>
              </div>

              {/* 결제 방법 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  결제 방법
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    💳 카드결제
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'transfer'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🏦 계좌이체
                  </button>
                </div>
              </div>

              {/* 결제 요약 */}
              {selectedPlan && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">결제 요약</h3>
                  {(() => {
                    const plan = plans.find(p => p.id === selectedPlan)
                    return plan ? (
                      <>
                        <div className="flex justify-between text-gray-600 mb-1">
                          <span>{plan.name}</span>
                          <span>{plan.price.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 text-lg border-t pt-2">
                          <span>총 결제금액</span>
                          <span>{plan.price.toLocaleString()}원</span>
                        </div>
                      </>
                    ) : null
                  })()}
                </div>
              )}

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={!selectedPlan}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedPlan ? '결제하기' : '멤버십을 선택해주세요'}
              </button>

              {/* 안내 문구 */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>• 결제 시 토스페이먼츠를 통해 안전하게 처리됩니다</p>
                <p>• 결제 후 즉시 멤버십이 활성화됩니다</p>
                <p>• 문의사항이 있으시면 고객센터로 연락주세요</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 