"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

export default function HexagonAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return

      const { left, top, width, height } = container.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) / 25
      const y = (e.clientY - top - height / 2) / 25

      container.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`
    }

    const handleMouseLeave = () => {
      container.style.transform = `rotateY(0deg) rotateX(0deg)`
      container.style.transition = "transform 0.5s ease-out"
    }

    const handleMouseEnter = () => {
      container.style.transition = "transform 0.1s ease-out"
    }

    // Only add mouse effects on non-mobile devices
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)
      container.addEventListener("mouseenter", handleMouseEnter)
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove)
        if (container) {
          container.removeEventListener("mouseleave", handleMouseLeave)
          container.removeEventListener("mouseenter", handleMouseEnter)
        }
      }
    }
  }, [isMobile])

  // Reduce number of elements on mobile
  const hexCount = isMobile ? 4 : 6
  const lineCount = isMobile ? 6 : 8

  return (
    <div
      ref={containerRef}
      className="w-full h-48 md:h-64 relative perspective-1000"
      style={{ transformStyle: "preserve-3d", transition: "transform 0.5s ease-out" }}
    >
      {/* Central node */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 z-20"
        animate={{
          boxShadow: [
            "0 0 20px rgba(16, 185, 129, 0.5)",
            "0 0 30px rgba(16, 185, 129, 0.7)",
            "0 0 20px rgba(16, 185, 129, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 opacity-80"></div>
        <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white opacity-70"></div>
      </motion.div>

      {/* Rotating hexagons - reduced number for better performance */}
      {[...Array(hexCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotateZ: [0, 360],
            z: [20, 40, 20],
          }}
          transition={{
            rotateZ: { duration: 20 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            z: { duration: 4 + i, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatType: "reverse" },
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative"
            style={{
              transform: `rotateY(${i * 60}deg) translateZ(80px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute w-8 h-8 md:w-10 md:h-10 transform -translate-x-1/2 -translate-y-1/2">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.8)"
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Connection lines - reduced for better performance */}
      {[...Array(lineCount)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute left-1/2 top-1/2 h-0.5 bg-gradient-to-r from-emerald-400/80 to-emerald-600/20 origin-left z-10"
          style={{
            width: "80px",
            transform: `rotate(${i * 45}deg)`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2 + i * 0.2,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50 -right-1 -top-0.5"
            animate={{
              left: ["0%", "100%", "0%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + i * 0.5,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
