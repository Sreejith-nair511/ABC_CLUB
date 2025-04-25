import EnhancedHero from "@/components/enhanced-hero"
import ChatbotWidget from "@/components/chatbot-widget"
import About from "@/components/about"
import Mission from "@/components/mission"
import Leadership from "@/components/leadership"
import GetInvolved from "@/components/get-involved"
import UpcomingActivities from "@/components/upcoming-activities"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white overflow-x-hidden">
      <EnhancedHero />
      <About />
      <Mission />
      <Leadership />
      <GetInvolved />
      <UpcomingActivities />
      <ChatbotWidget />
    </main>
  )
}
