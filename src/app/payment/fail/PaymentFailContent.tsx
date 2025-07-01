'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentFailContent() {
  const searchParams = useSearchParams()
  const [errorInfo, setErrorInfo] = useState<{
    code: string;
    message: string;
    orderId: string;
    timestamp: string;
  } | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const message = searchParams.get('message')
    const orderId = searchParams.get('orderId')

    setErrorInfo({
      code: code || 'UNKNOWN_ERROR',
      message: message || '알 수 없는 오류가 발생했습니다.',
      orderId: orderId || '',
      timestamp: new Date().toLocaleString('ko-KR')
    })
  }, [searchParams])

  const getErrorMessage = (code: string) => {
    const errorMessages: { [key: string]: string } = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'INSUFFICIENT_BALANCE': '잔액이 부족합니다.',
      'INVALID_CARD_NUMBER': '유효하지 않은 카드번호입니다.',
      'EXPIRED_CARD': '만료된 카드입니다.',
      'INVALID_UNREGISTERED_SUBMALL': '등록되지 않은 서브몰입니다.',
      'UNKNOWN_ERROR': '알 수 없는 오류가 발생했습니다.'
    }
    return errorMessages[code] || errorMessages['UNKNOWN_ERROR']
  }

  const getSolution = (code: string) => {
    const solutions: { [key: string]: string[] } = {
      'PAY_PROCESS_CANCELED': [
        '다시 결제를 진행해 주세요.',
        '다른 결제 수단을 이용해 보세요.'
      ],
      'REJECT_CARD_COMPANY': [
        '카드사에 문의하여 결제 제한 여부를 확인해 주세요.',
        '다른 카드로 결제를 시도해 보세요.',
        '계좌이체나 다른 결제 수단을 이용해 보세요.'
      ],
      'INSUFFICIENT_BALANCE': [
        '계좌 잔액을 확인하고 충전 후 다시 시도해 주세요.',
        '다른 카드나 계좌를 이용해 보세요.'
      ],
      'INVALID_CARD_NUMBER': [
        '카드번호를 다시 확인해 주세요.',
        '다른 카드로 결제를 시도해 보세요.'
      ],
      'EXPIRED_CARD': [
        '새로운 카드로 결제를 시도해 주세요.',
        '카드 갱신 후 다시 이용해 주세요.'
      ]
    }
    return solutions[code] || [
      '잠시 후 다시 시도해 주세요.',
      '문제가 지속되면 고객센터로 문의해 주세요.'
    ]
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* 실패 아이콘 */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제에 실패했습니다 😔
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            결제 처리 중 문제가 발생했습니다.
          </p>

          {/* 오류 정보 */}
          {errorInfo && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-red-900 mb-4">오류 정보</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700">오류 코드:</span>
                  <span className="font-semibold text-red-900">{errorInfo.code}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-red-700 mb-1">오류 메시지:</span>
                  <span className="font-semibold text-red-900">{getErrorMessage(errorInfo.code)}</span>
                </div>
                {errorInfo.orderId && (
                  <div className="flex justify-between">
                    <span className="text-red-700">주문번호:</span>
                    <span className="font-semibold text-red-900">{errorInfo.orderId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-red-700">발생시간:</span>
                  <span className="font-semibold text-red-900">{errorInfo.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* 해결 방법 */}
          {errorInfo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-yellow-900 mb-2">해결 방법</h3>
              <ul className="text-sm text-yellow-800 text-left space-y-1">
                {getSolution(errorInfo.code).map((solution, index) => (
                  <li key={index}>• {solution}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/payment"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              다시 결제하기
            </Link>
            <Link
              href="/booking"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              예약 먼저 하기
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
              결제 문제가 계속 발생하시면 고객센터로 문의해 주세요
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-2">
              📞 02-1234-5678 | 📧 support@infinitygym.com
            </p>
            <p className="text-xs text-gray-500">
              평일 09:00-18:00 | 토요일 09:00-15:00 | 일요일 휴무
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 