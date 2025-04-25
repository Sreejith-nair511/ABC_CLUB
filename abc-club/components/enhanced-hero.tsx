"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import HexagonAnimation from "./hexagon-animation"
import { useMobile } from "@/hooks/use-mobile"

export default function EnhancedHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ maxHeight: isMobile ? "100vh" : "100vh" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0,rgba(0,0,0,0)_70%)]"></div>

        {/* Digital blocks/flowing data background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black"></div>
      </div>

      {/* Content container */}
      <div className="container-width px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* 3D Blockchain Logo/Hexagon Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xs md:max-w-sm mb-6 md:mb-8"
          >
            <HexagonAnimation />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight text-white"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 neon-text">
              ABC Club
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl lg:text-2xl text-gray-300 max-w-2xl mb-6 md:mb-8"
          >
            Empowering the Next Generation of Decentralized Innovators
          </motion.p>

          {/* Enter Site button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={cn(
                "group relative overflow-hidden px-6 py-3 rounded-full bg-transparent border-2 border-emerald-500 text-white font-medium transition-all duration-300",
                isHovered ? "bg-emerald-500/10" : "",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                Enter Site
                <motion.span animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.3 }}>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "0%" : "-100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="bg-emerald-500/10 rounded-full p-2"
        >
          <ChevronDown className="h-5 w-5 text-emerald-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
