export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
              인피니티짐
            </a>
          </div>
          
          <nav className="flex space-x-6">
            <a href="/" className="hover:text-gray-300 transition-colors">홈</a>
            <a href="/portfolio" className="hover:text-gray-300 transition-colors">포트폴리오</a>
            <a href="/booking" className="hover:text-gray-300 transition-colors">예약</a>
            <a href="/reviews" className="hover:text-gray-300 transition-colors">후기</a>
            <a href="/payment" className="hover:text-gray-300 transition-colors">결제</a>
          </nav>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; 2024 인피니티짐. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 