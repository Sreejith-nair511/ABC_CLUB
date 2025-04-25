"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function FloatingBlockchain() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = container.getBoundingClientRect()

      const x = (clientX - left) / width - 0.5
      const y = (clientY - top) / height - 0.5

      // Calculate rotation based on mouse position
      const rotateY = x * 20
      const rotateX = y * -20

      // Apply rotation with smooth transition
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="absolute right-10 bottom-20 hidden lg:block z-10"
    >
      <div
        ref={containerRef}
        className="relative w-40 h-40 transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Blockchain nodes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6"
            style={{
              transform: `translateZ(${20 + i * 5}px) translate(${Math.cos((i * Math.PI) / 4) * 50}px, ${Math.sin((i * Math.PI) / 4) * 50}px)`,
              transformStyle: "preserve-3d",
            }}
            animate={{
              z: [20 + i * 5, 30 + i * 5, 20 + i * 5],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + i * 0.5,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-80"></div>
              <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-white opacity-70"></div>
            </div>
          </motion.div>
        ))}

        {/* Connection lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const startIndex = i % 8
          const endIndex = (startIndex + 1 + Math.floor(i / 8)) % 8

          const startAngle = (startIndex * Math.PI) / 4
          const endAngle = (endIndex * Math.PI) / 4

          const startX = Math.cos(startAngle) * 50
          const startY = Math.sin(startAngle) * 50
          const endX = Math.cos(endAngle) * 50
          const endY = Math.sin(endAngle) * 50

          const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
          const angle = Math.atan2(endY - startY, endX - startX)

          return (
            <motion.div
              key={`line-${i}`}
              className="absolute w-full h-0.5 bg-gradient-to-r from-emerald-400/80 to-emerald-600/80 origin-left"
              style={{
                left: `${startX + 70}px`,
                top: `${startY + 70}px`,
                width: `${length}px`,
                transform: `rotate(${angle}rad)`,
                transformStyle: "preserve-3d",
                zIndex: 10 + i,
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
          )
        })}
      </div>
    </motion.div>
  )
}
