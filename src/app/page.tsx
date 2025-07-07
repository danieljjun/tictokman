import Header from '@/components/Header'
import Banner from '@/components/Banner'
import BookingStatusSection from '@/components/BookingStatusSection'
import AISystemSection from '@/components/AISystemSection'
import ProgramSection from '@/components/ProgramSection'
import PortfolioSection from '@/components/PortfolioSection'
import ReviewSection from '@/components/ReviewSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Banner />
      <BookingStatusSection />
      <AISystemSection />
      <ProgramSection />
      <PortfolioSection />
      <ReviewSection />
    </main>
  )
}
