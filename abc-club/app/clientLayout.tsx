"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useState, useEffect } from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import StartupAnimation from "@/components/startup-animation"

const inter = Inter({ subsets: ["latin"] })

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited")
    if (hasVisited) {
      setShowAnimation(false)
      setAnimationComplete(true)
    } else {
      sessionStorage.setItem("hasVisited", "true")
    }
  }, [])

  const handleAnimationComplete = () => {
    setAnimationComplete(true)
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white overflow-x-hidden`}>
        {showAnimation && <StartupAnimation onComplete={handleAnimationComplete} />}

        {animationComplete && (
          <>
            <Header />
            {children}
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
