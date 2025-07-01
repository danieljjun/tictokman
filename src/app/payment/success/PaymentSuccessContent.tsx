'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: string;
    paymentKey: string;
    amount: number;
    timestamp: string;
  } | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const paymentKey = searchParams.get('paymentKey')
    const amount = searchParams.get('amount')

    if (orderId && paymentKey && amount) {
      setPaymentInfo({
        orderId,
        paymentKey,
        amount: parseInt(amount),
        timestamp: new Date().toLocaleString('ko-KR')
      })
    }
  }, [searchParams])

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제가 완료되었습니다! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            인피니티짐 멤버십 결제가 성공적으로 처리되었습니다.
          </p>

          {/* 결제 정보 */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 정보</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호:</span>
                  <span className="font-semibold">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액:</span>
                  <span className="font-semibold">{paymentInfo.amount?.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제일시:</span>
                  <span className="font-semibold">{paymentInfo.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제수단:</span>
                  <span className="font-semibold">토스페이먼츠</span>
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">다음 단계</h3>
            <ul className="text-sm text-blue-800 text-left space-y-1">
              <li>• 결제 완료 확인 이메일이 발송됩니다</li>
              <li>• 멤버십은 즉시 활성화되며, 오늘부터 이용 가능합니다</li>
              <li>• 첫 방문 시 신분증을 지참해 주세요</li>
              <li>• AI 진단을 위한 Total Check 예약을 권장드립니다</li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              세션 예약하기
            </Link>
            <Link
              href="/portfolio"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              포트폴리오 보기
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>

          {/* 고객센터 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              문의사항이 있으시면 고객센터로 연락주세요
            </p>
            <p className="text-sm font-semibold text-gray-900">
              📞 02-1234-5678 | 📧 support@infinitygym.com
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 