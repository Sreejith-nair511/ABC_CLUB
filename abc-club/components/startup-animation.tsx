"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function StartupAnimation({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

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

    // Animation variables
    let animationId: number
    const startTime = Date.now()
    const animationDuration = 3500 // 3.5 seconds
    const totalNodes = 35
    const nodes: Node[] = []
    const connections: Connection[] = []

    // Node class
    class Node {
      x: number
      y: number
      size: number
      targetSize: number
      opacity: number
      targetOpacity: number
      birthTime: number
      connections: number[]
      pulsePhase: number
      pulseSpeed: number

      constructor(x: number, y: number, birthTime: number) {
        this.x = x
        this.y = y
        this.size = 0
        this.targetSize = 2 + Math.random() * 3
        this.opacity = 0
        this.targetOpacity = 0.7 + Math.random() * 0.3
        this.birthTime = birthTime
        this.connections = []
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.03 + Math.random() * 0.02
      }

      update(currentTime: number) {
        if (currentTime < this.birthTime) return false

        const age = currentTime - this.birthTime
        const appearDuration = 300
        const progress = Math.min(1, age / appearDuration)

        this.size = this.size + (this.targetSize * progress - this.size) * 0.1
        this.opacity = this.opacity + (this.targetOpacity * progress - this.opacity) * 0.1

        // Update pulse phase for pulsing effect
        this.pulsePhase += this.pulseSpeed

        return true
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Pulse effect
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1
        const currentSize = this.size * pulse

        // Create gradient for node with more vibrant center
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 3)
        gradient.addColorStop(0, `rgba(16, 245, 129, ${this.opacity})`)
        gradient.addColorStop(0.3, `rgba(16, 215, 129, ${this.opacity * 0.8})`)
        gradient.addColorStop(0.7, `rgba(16, 185, 129, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(16, 185, 129, 0)`)

        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Add glossy highlight
        ctx.beginPath()
        ctx.arc(this.x - currentSize * 0.3, this.y - currentSize * 0.3, currentSize * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`
        ctx.fill()

        // Add outer glow for more depth
        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize * 2, 0, Math.PI * 2)
        const outerGlow = ctx.createRadialGradient(this.x, this.y, currentSize, this.x, this.y, currentSize * 2)
        outerGlow.addColorStop(0, `rgba(16, 245, 129, ${this.opacity * 0.2})`)
        outerGlow.addColorStop(1, `rgba(16, 185, 129, 0)`)
        ctx.fillStyle = outerGlow
        ctx.fill()
      }
    }

    // Connection class
    class Connection {
      nodeA: number
      nodeB: number
      progress: number
      opacity: number
      pulsePhase: number
      birthTime: number
      packetProgress: number
      packetSpeed: number
      hasPacket: boolean

      constructor(nodeA: number, nodeB: number, birthTime: number) {
        this.nodeA = nodeA
        this.nodeB = nodeB
        this.progress = 0
        this.opacity = 0
        this.pulsePhase = Math.random() * Math.PI * 2
        this.birthTime = birthTime
        this.packetProgress = 0
        this.packetSpeed = 0.005 + Math.random() * 0.01
        this.hasPacket = Math.random() < 0.7 // 70% chance to have a packet
      }

      update(currentTime: number, nodes: Node[]) {
        if (currentTime < this.birthTime) return false

        const age = currentTime - this.birthTime
        const appearDuration = 800
        const progress = Math.min(1, age / appearDuration)

        this.progress = this.progress + (progress - this.progress) * 0.1
        this.opacity = this.opacity + (0.6 * progress - this.opacity) * 0.1
        this.pulsePhase += 0.02

        // Update packet position
        if (this.hasPacket && this.progress > 0.9) {
          this.packetProgress += this.packetSpeed
          if (this.packetProgress > 1) {
            this.packetProgress = 0
          }
        }

        return true
      }

      draw(ctx: CanvasRenderingContext2D, nodes: Node[]) {
        const nodeA = nodes[this.nodeA]
        const nodeB = nodes[this.nodeB]

        // Calculate line points based on progress
        const startX = nodeA.x
        const startY = nodeA.y
        const endX = startX + (nodeB.x - startX) * this.progress
        const endY = startY + (nodeB.y - startY) * this.progress

        // Create gradient for connection
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)

        // Pulse effect
        const pulse = (Math.sin(this.pulsePhase) + 1) * 0.5 * 0.3 + 0.7
        const opacityWithPulse = this.opacity * pulse

        gradient.addColorStop(0, `rgba(16, 245, 129, ${opacityWithPulse})`)
        gradient.addColorStop(0.5, `rgba(16, 215, 129, ${opacityWithPulse * 0.7})`)
        gradient.addColorStop(1, `rgba(16, 185, 129, ${opacityWithPulse})`)

        // Draw line with glow effect
        ctx.shadowColor = "rgba(16, 245, 129, 0.3)"
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw data packet if connection is complete and has a packet
        if (this.hasPacket && this.progress > 0.9) {
          const packetX = startX + (nodeB.x - startX) * this.packetProgress
          const packetY = startY + (nodeB.y - startY) * this.packetProgress

          // Create gradient for packet
          const packetGradient = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 4)
          packetGradient.addColorStop(0, "rgba(16, 245, 129, 0.9)")
          packetGradient.addColorStop(0.5, "rgba(16, 215, 129, 0.6)")
          packetGradient.addColorStop(1, "rgba(16, 185, 129, 0)")

          ctx.beginPath()
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2)
          ctx.fillStyle = packetGradient
          ctx.fill()

          // Add glow to packet
          ctx.shadowColor = "rgba(16, 245, 129, 0.6)"
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(16, 245, 129, 0.8)"
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
    }

    // Create initial center node
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    nodes.push(new Node(centerX, centerY, startTime))

    // Animation loop
    const animate = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(1, elapsedTime / animationDuration)

      setAnimationProgress(progress)

      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Create glossy background effect with vignette
      const backgroundGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(window.innerWidth, window.innerHeight) * 0.7,
      )
      backgroundGradient.addColorStop(0, "rgba(10, 15, 20, 0.4)")
      backgroundGradient.addColorStop(0.5, "rgba(5, 10, 15, 0.2)")
      backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = backgroundGradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw subtle hex pattern
      if (progress > 0.2) {
        drawHexPattern(ctx, progress)
      }

      // Add new nodes based on progress
      if (nodes.length < totalNodes && Math.random() < 0.1 && progress < 0.8) {
        // Create new node at random position
        let x, y
        if (nodes.length < 5) {
          // First few nodes should be closer to center
          const angle = Math.random() * Math.PI * 2
          const distance = 50 + Math.random() * 50
          x = centerX + Math.cos(angle) * distance
          y = centerY + Math.sin(angle) * distance
        } else {
          // Later nodes can be further out
          const angle = Math.random() * Math.PI * 2
          const distance = 100 + Math.random() * 180
          x = centerX + Math.cos(angle) * distance
          y = centerY + Math.sin(angle) * distance
        }

        nodes.push(new Node(x, y, currentTime))

        // Connect to a random existing node
        const newNodeIndex = nodes.length - 1
        const connectToIndex = Math.floor(Math.random() * newNodeIndex)

        connections.push(new Connection(connectToIndex, newNodeIndex, currentTime))
        nodes[connectToIndex].connections.push(newNodeIndex)
        nodes[newNodeIndex].connections.push(connectToIndex)

        // Add some extra connections for a more complex network
        if (nodes.length > 5 && Math.random() < 0.4) {
          const otherNodeIndex = Math.floor(Math.random() * newNodeIndex)
          if (otherNodeIndex !== connectToIndex && !nodes[newNodeIndex].connections.includes(otherNodeIndex)) {
            connections.push(new Connection(otherNodeIndex, newNodeIndex, currentTime + 200))
            nodes[otherNodeIndex].connections.push(newNodeIndex)
            nodes[newNodeIndex].connections.push(otherNodeIndex)
          }
        }
      }

      // Update and draw connections
      for (const connection of connections) {
        connection.update(currentTime, nodes)
        connection.draw(ctx, nodes)
      }

      // Update and draw nodes
      for (const node of nodes) {
        node.update(currentTime)
        node.draw(ctx)
      }

      // Continue animation if not complete
      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setTimeout(() => {
          setIsComplete(true)
          onComplete()
        }, 500)
      }
    }

    // Function to draw subtle hex pattern
    function drawHexPattern(ctx: CanvasRenderingContext2D, progress: number) {
      const hexSize = 20
      const hexSpacing = 40
      const hexOpacity = Math.min(0.1, progress * 0.15)

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

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Club logo that fades in near the end */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: animationProgress > 0.7 ? 1 : 0,
              scale: animationProgress > 0.7 ? 1 : 0.9,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-48 md:w-64 mx-auto mb-2">
              <img src="/images/abc-logo.png" alt="ABC Blockchain Club" className="w-full h-auto" />
            </div>
            <p className="text-emerald-100 text-lg md:text-xl opacity-80 tracking-widest">BLOCKCHAIN CLUB CIT</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
