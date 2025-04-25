"use client"

import { useEffect, useRef } from "react"

export default function GlossyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create glossy background effect
    const drawGlossyBackground = () => {
      // Create base gradient
      const baseGradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)
      baseGradient.addColorStop(0, "#0a0a0f")
      baseGradient.addColorStop(1, "#000000")

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Add subtle radial highlight
      const centerX = window.innerWidth * 0.5
      const centerY = window.innerHeight * 0.3
      const radius = Math.max(window.innerWidth, window.innerHeight) * 0.7

      const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)

      radialGradient.addColorStop(0, "rgba(30, 30, 40, 0.4)")
      radialGradient.addColorStop(0.5, "rgba(20, 20, 30, 0.1)")
      radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Add subtle light streaks
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * window.innerWidth
        const y = Math.random() * window.innerHeight * 0.5
        const width = 100 + Math.random() * 200
        const height = 300 + Math.random() * 500

        const streakGradient = ctx.createRadialGradient(x, y, 0, x, y, height)

        streakGradient.addColorStop(0, "rgba(30, 30, 40, 0.1)")
        streakGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = streakGradient
        ctx.beginPath()
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initial draw
    drawGlossyBackground()

    // Redraw on resize
    window.addEventListener("resize", drawGlossyBackground)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("resize", drawGlossyBackground)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
