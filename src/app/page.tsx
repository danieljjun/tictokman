import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import AISystemSection from '@/components/AISystemSection'
import ProgramSection from '@/components/ProgramSection'
import ReviewSection from '@/components/ReviewSection'
import PortfolioSection from '@/components/PortfolioSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AISystemSection />
      <ProgramSection />
      <PortfolioSection />
      <ReviewSection />
      <Footer />
    </main>
  )
}
