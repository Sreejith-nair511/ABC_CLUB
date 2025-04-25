"use client"

import { useEffect, useRef, useState } from "react"

export default function BlockchainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)

    // Node class
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

      constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.size = size
        this.originalSize = size
        this.color = "#10B981"
        this.connections = []
        this.speed = {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
        }
        this.opacity = 0.2 + Math.random() * 0.3
        this.targetOpacity = this.opacity
        this.glowing = false
      }

      update(mouseX?: number, mouseY?: number, scrollIntensity = 1) {
        // Move node
        this.x += this.speed.x
        this.y += this.speed.y

        // Bounce off edges
        if (this.x <= 0 || this.x >= canvas.width) this.speed.x *= -1
        if (this.y <= 0 || this.y >= canvas.height) this.speed.y *= -1

        // Handle mouse interaction
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const hoverRadius = 100

          if (distance < hoverRadius) {
            this.glowing = true
            this.targetOpacity = 0.8
            this.size = this.originalSize * (1 + (1 - distance / hoverRadius) * 2)
          } else {
            this.glowing = false
            this.targetOpacity = 0.2 + Math.random() * 0.3
            this.size = this.originalSize
          }
        }

        // Apply scroll intensity
        this.size = this.originalSize * (1 + scrollIntensity * 0.2)

        // Smooth opacity transition
        this.opacity += (this.targetOpacity - this.opacity) * 0.1
      }

      draw() {
        if (!ctx) return

        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()

        // Add glow effect for highlighted nodes
        if (this.glowing) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, this.size * 2)
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
          ctx.fillStyle = gradient
          ctx.fill()
        }

        ctx.globalAlpha = 1
      }
    }

    // Create nodes
    const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80)
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 2 + 1
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      nodes.push(new Node(x, y, size))
    }

    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            nodes[i].connections.push(nodes[j])
          }
        }
      }
    }

    // Mouse tracking
    let mouseX: number | undefined
    let mouseY: number | undefined

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    })

    canvas.addEventListener("mouseleave", () => {
      mouseX = undefined
      mouseY = undefined
    })

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate scroll intensity (0 to 1)
      const scrollIntensity = Math.min(scrollY / 500, 1)

      // Update and draw nodes
      for (const node of nodes) {
        node.update(mouseX, mouseY, scrollIntensity)
      }

      // Draw connections
      ctx.lineWidth = 0.5
      ctx.strokeStyle = "#10B981"

      for (const node of nodes) {
        for (const connectedNode of node.connections) {
          const dx = node.x - connectedNode.x
          const dy = node.y - connectedNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Pulse effect
            const pulse = (Math.sin(time * 2) + 1) * 0.5
            const opacity = (1 - distance / 150) * 0.2 * (1 + pulse * 0.5)

            // Increase opacity based on scroll
            const scrollOpacityBoost = 1 + scrollIntensity * 0.5

            ctx.globalAlpha = opacity * scrollOpacityBoost

            // Draw line
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.stroke()

            // Draw data packet traveling along the line
            if (Math.random() < 0.002) {
              const packetProgress = (time * 3) % 1
              const packetX = node.x + (connectedNode.x - node.x) * packetProgress
              const packetY = node.y + (connectedNode.y - node.y) * packetProgress

              ctx.beginPath()
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
              ctx.fillStyle = "#10B981"
              ctx.globalAlpha = 0.8
              ctx.fill()
            }
          }
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1

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
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.6, pointerEvents: "none" }} />
}
