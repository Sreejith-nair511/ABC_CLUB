"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function EnhancedBlockchainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharper rendering
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

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)

    // Handle mouse movement
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

    // Node class with enhanced visuals
    class Node {
      x: number
      y: number
      size: number
      originalSize: number
      color: string
      connections: Node[]
      speed: { x: number; y: number }
      opacity: number
      targetOpacity: number
      glowing: boolean
      pulsePhase: number
      pulseSpeed: number

      constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.size = size
        this.originalSize = size
        this.color = "#10B981"
        this.connections = []
        this.speed = {
          x: (Math.random() - 0.5) * 0.15,
          y: (Math.random() - 0.5) * 0.15,
        }
        this.opacity = 0.2 + Math.random() * 0.3
        this.targetOpacity = this.opacity
        this.glowing = false
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.03 + Math.random() * 0.02
      }

      update(mouseX?: number, mouseY?: number, scrollIntensity = 1) {
        // Move node
        this.x += this.speed.x
        this.y += this.speed.y

        // Bounce off edges with padding
        const padding = 50
        if (this.x <= padding || this.x >= window.innerWidth - padding) this.speed.x *= -1
        if (this.y <= padding || this.y >= window.innerHeight - padding) this.speed.y *= -1

        // Keep node within bounds
        this.x = Math.max(padding, Math.min(window.innerWidth - padding, this.x))
        this.y = Math.max(padding, Math.min(window.innerHeight - padding, this.y))

        // Handle mouse interaction
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const hoverRadius = 120

          if (distance < hoverRadius) {
            this.glowing = true
            this.targetOpacity = 0.9
            this.size = this.originalSize * (1 + (1 - distance / hoverRadius) * 2.5)
          } else {
            this.glowing = false
            this.targetOpacity = 0.2 + Math.random() * 0.3
            this.size = this.originalSize
          }
        }

        // Update pulse phase
        this.pulsePhase += this.pulseSpeed

        // Apply scroll intensity to size and pulse
        const pulseAmount = Math.sin(this.pulsePhase) * 0.2 + 0.8
        this.size = this.originalSize * pulseAmount * (1 + scrollIntensity * 0.3)

        // Smooth opacity transition
        this.opacity += (this.targetOpacity - this.opacity) * 0.1
      }

      draw() {
        if (!ctx) return

        // Draw node with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)

        if (this.glowing) {
          // Brighter gradient for glowing nodes
          gradient.addColorStop(0, "rgba(16, 245, 129, 0.9)")
          gradient.addColorStop(0.3, "rgba(16, 185, 129, 0.7)")
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

          // Draw outer glow
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
          const outerGlow = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, this.size * 3)
          outerGlow.addColorStop(0, "rgba(16, 245, 129, 0.2)")
          outerGlow.addColorStop(1, "rgba(16, 185, 129, 0)")
          ctx.fillStyle = outerGlow
          ctx.fill()
        } else {
          // Standard gradient
          gradient.addColorStop(0, "rgba(16, 215, 129, 0.8)")
          gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.4)")
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
        }

        // Draw main node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = this.opacity
        ctx.fill()

        // Add glossy highlight
        ctx.beginPath()
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()

        ctx.globalAlpha = 1
      }
    }

    // Create nodes - fewer on mobile for performance
    const nodeCount = isMobile
      ? Math.min(Math.floor((window.innerWidth * window.innerHeight) / 25000), 40)
      : Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80)

    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 2 + 1
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      nodes.push(new Node(x, y, size))
    }

    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 180) {
            nodes[i].connections.push(nodes[j])
          }
        }
      }
    }

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Calculate scroll intensity (0 to 1)
      const scrollIntensity = Math.min(scrollY / 500, 1)

      // Draw glossy background effect
      const backgroundGradient = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth * 0.7,
      )
      backgroundGradient.addColorStop(0, "rgba(10, 10, 15, 0.3)")
      backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = backgroundGradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Update nodes
      for (const node of nodes) {
        node.update(mousePosition?.x, mousePosition?.y, scrollIntensity)
      }

      // Draw connections with enhanced effects
      for (const node of nodes) {
        for (const connectedNode of node.connections) {
          const dx = node.x - connectedNode.x
          const dy = node.y - connectedNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 180) {
            // Create gradient for connection
            const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y)

            // Determine if either node is glowing
            const isGlowing = node.glowing || connectedNode.glowing

            if (isGlowing) {
              gradient.addColorStop(0, "rgba(16, 245, 129, 0.8)")
              gradient.addColorStop(0.5, "rgba(16, 215, 129, 0.5)")
              gradient.addColorStop(1, "rgba(16, 185, 129, 0.8)")
            } else {
              // Pulse effect
              const pulse = (Math.sin(time * 2 + node.pulsePhase) + 1) * 0.5
              const opacity = (1 - distance / 180) * 0.25 * (1 + pulse * 0.5)

              // Increase opacity based on scroll
              const scrollOpacityBoost = 1 + scrollIntensity * 0.7

              gradient.addColorStop(0, `rgba(16, 215, 129, ${opacity * scrollOpacityBoost})`)
              gradient.addColorStop(0.5, `rgba(16, 185, 129, ${opacity * scrollOpacityBoost * 0.7})`)
              gradient.addColorStop(1, `rgba(16, 185, 129, ${opacity * scrollOpacityBoost})`)
            }

            // Draw line with gradient
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = isGlowing ? 1.5 : 0.8
            ctx.stroke()

            // Draw data packet traveling along the line
            if (Math.random() < 0.002 || (isGlowing && Math.random() < 0.02)) {
              const packetProgress = (time * 3) % 1
              const packetX = node.x + (connectedNode.x - node.x) * packetProgress
              const packetY = node.y + (connectedNode.y - node.y) * packetProgress

              // Create gradient for packet
              const packetGradient = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 4)
              packetGradient.addColorStop(0, "rgba(16, 245, 129, 0.9)")
              packetGradient.addColorStop(1, "rgba(16, 185, 129, 0)")

              ctx.beginPath()
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
              ctx.fillStyle = packetGradient
              ctx.fill()
            }
          }
        }
      }

      // Draw nodes on top of connections
      for (const node of nodes) {
        node.draw()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("scroll", handleScroll)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [isMobile])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.8 }} />
}
