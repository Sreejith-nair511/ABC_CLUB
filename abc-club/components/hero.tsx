"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import EnhancedParticleField from "./enhanced-particle-field"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const isMobile = useMobile()
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale, y }}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 z-0">
        <EnhancedParticleField />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black z-10"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>

      <div className="container-width px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="flex flex-col items-center">
              <div className="w-48 md:w-64 mb-6">
                <img src="/images/abc-logo.png" alt="ABC Blockchain Club" className="w-full h-auto" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest">
                <span className="tracking-widest">Blockchain Club CIT</span>
              </h1>
            </div>

            <AnimatePresence>
              {showTooltip && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg text-sm max-w-xs text-emerald-100 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 z-20"
                >
                  You're not just joining a club, you're joining a revolution.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl font-light mb-6 text-emerald-100 tracking-wide"
          >
            Building Blocks for the Decentralized Future
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            An initiative by the ISE Department to explore blockchain technology and foster innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="relative"
          >
            {/* Neon green light ripple behind button */}
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 rounded-md shadow-lg shadow-emerald-500/20 btn-glossy relative z-10 hover:scale-105 transition-transform duration-300"
            >
              <a href="#get-involved">Join the Movement</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <p className="text-gray-400 mb-2 text-sm">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="bg-emerald-500/10 rounded-full p-2 hover:bg-emerald-500/20 transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-emerald-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
