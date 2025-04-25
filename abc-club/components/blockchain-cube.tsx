"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function BlockchainCube() {
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cubeRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate rotation based on mouse position
      const rotateY = (clientX / innerWidth - 0.5) * 20
      const rotateX = (clientY / innerHeight - 0.5) * -20

      cubeRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute right-10 bottom-20 opacity-40 hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="w-32 h-32 perspective-500"
      >
        <div
          ref={cubeRef}
          className="relative w-full h-full transform-style-3d transition-transform duration-300 ease-out"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "rotateY(180deg) translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Left face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "rotateY(-90deg) translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Right face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "rotateY(90deg) translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Top face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "rotateX(90deg) translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Bottom face */}
          <div
            className="absolute w-full h-full border-2 border-emerald-500/30 bg-black/30 backdrop-blur-sm"
            style={{ transform: "rotateX(-90deg) translateZ(16px)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
