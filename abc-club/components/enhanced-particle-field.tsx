"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function EnhancedParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

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

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      opacity: number
      baseOpacity: number
      color: string
      pulsePhase: number
      pulseSpeed: number
      z: number // For parallax effect

      constructor() {
        this.z = Math.random() * 3 + 1 // z-depth for parallax (1-4)
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.baseSize = (Math.random() * 1.5 + 0.5) / this.z
        this.size = this.baseSize
        this.speedX = ((Math.random() - 0.5) * 0.2) / this.z
        this.speedY = ((Math.random() - 0.5) * 0.2) / this.z
        this.baseOpacity = (Math.random() * 0.5 + 0.1) * (1 / this.z)
        this.opacity = this.baseOpacity
        this.color = `rgba(16, ${185 + Math.floor(Math.random() * 60)}, 129, ${this.opacity})`
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.02 + Math.random() * 0.02
      }

      update(mouseX?: number, mouseY?: number) {
        // Move particle
        this.x += this.speedX
        this.y += this.speedY

        // Update pulse phase
        this.pulsePhase += this.pulseSpeed
        this.size = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.2)

        // Wrap around edges
        if (this.x < 0) this.x = window.innerWidth
        if (this.x > window.innerWidth) this.x = 0
        if (this.y < 0) this.y = window.innerHeight
        if (this.y > window.innerHeight) this.y = 0

        // Mouse interaction
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const mouseRadius = 150 / this.z

          if (distance < mouseRadius) {
            // Increase opacity and size when mouse is near
            const factor = 1 - distance / mouseRadius
            this.opacity = this.baseOpacity + factor * 0.5

            // Gentle repulsion
            const angle = Math.atan2(dy, dx)
            const force = (mouseRadius - distance) * 0.01
            this.x += Math.cos(angle) * force
            this.y += Math.sin(angle) * force
          } else {
            this.opacity = this.baseOpacity
          }
        } else {
          this.opacity = this.baseOpacity
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)
        gradient.addColorStop(0, `rgba(16, 245, 129, ${this.opacity})`)
        gradient.addColorStop(0.5, `rgba(16, 215, 129, ${this.opacity * 0.7})`)
        gradient.addColorStop(1, `rgba(16, 185, 129, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Create particles - fewer on mobile
    const particleCount = isMobile ? 40 : 80
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseLeave = () => {
      setMousePosition(null)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Create glossy background with vignette effect
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth * 0.8,
      )
      gradient.addColorStop(0, "rgba(10, 20, 25, 0.4)")
      gradient.addColorStop(0.5, "rgba(5, 15, 20, 0.2)")
      gradient.addColorStop(1, "rgba(0, 5, 10, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw subtle hex pattern
      drawHexPattern(ctx, time)

      // Update and draw particles
      for (const particle of particles) {
        particle.update(mousePosition?.x, mousePosition?.y)
        particle.draw(ctx)

        // Connect particles that are close to each other
        for (const otherParticle of particles) {
          if (particle === otherParticle) continue

          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 100 * (2 / (particle.z + otherParticle.z))

          if (distance < maxDistance) {
            // Calculate opacity based on distance and particle depths
            const opacity = (1 - distance / maxDistance) * 0.2 * (1 / (particle.z * 0.5 + otherParticle.z * 0.5))

            // Create gradient for connection
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
            gradient.addColorStop(0, `rgba(16, 215, 129, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(16, 185, 129, ${opacity * 0.5})`)
            gradient.addColorStop(1, `rgba(16, 215, 129, ${opacity})`)

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Occasionally add data packet animation
            if (Math.random() < 0.0005) {
              const packetProgress = Math.random()
              const packetX = particle.x + (otherParticle.x - particle.x) * packetProgress
              const packetY = particle.y + (otherParticle.y - particle.y) * packetProgress

              const packetGradient = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 3)
              packetGradient.addColorStop(0, "rgba(16, 245, 129, 0.8)")
              packetGradient.addColorStop(1, "rgba(16, 185, 129, 0)")

              ctx.beginPath()
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
              ctx.fillStyle = packetGradient
              ctx.fill()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    // Function to draw subtle hex pattern
    function drawHexPattern(ctx: CanvasRenderingContext2D, time: number) {
      const hexSize = 20
      const hexSpacing = 60
      const hexOpacity = 0.05 + Math.sin(time * 0.2) * 0.02

      ctx.strokeStyle = `rgba(16, 185, 129, ${hexOpacity})`
      ctx.lineWidth = 0.5

      const startX = 0
      const startY = 0
      const endX = window.innerWidth
      const endY = window.innerHeight

      for (let y = startY; y < endY; y += hexSpacing) {
        for (let x = startX + (y % (hexSpacing * 2) === 0 ? 0 : hexSpacing / 2); x < endX; x += hexSpacing) {
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = ((2 * Math.PI) / 6) * i
            const hx = x + hexSize * Math.cos(angle)
            const hy = y + hexSize * Math.sin(angle)
            if (i === 0) {
              ctx.moveTo(hx, hy)
            } else {
              ctx.lineTo(hx, hy)
            }
          }
          ctx.closePath()
          ctx.stroke()
        }
      }
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [isMobile, mousePosition])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
