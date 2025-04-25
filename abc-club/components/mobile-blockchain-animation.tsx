"use client"

import { useRef, useEffect } from "react"

export default function MobileBlockchainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Node class
    class Node {
      x: number
      y: number
      radius: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 1.5 + 0.5
        this.color = "#10B981"
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create a grid of nodes
    const spacing = 40
    const nodes: Node[] = []

    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        // Add some randomness to the grid
        const offsetX = (Math.random() - 0.5) * spacing * 0.5
        const offsetY = (Math.random() - 0.5) * spacing * 0.5
        nodes.push(new Node(x + offsetX, y + offsetY))
      }
    }

    // Animation variables
    let time = 0
    const connections: [number, number][] = []

    // Pre-calculate connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < spacing * 1.5) {
          connections.push([i, j])
        }
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      // Draw connections with pulsing effect
      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 0.3

      for (const [i, j] of connections) {
        const pulseOffset = (Math.sin(time + i * 0.1) + 1) * 0.5
        ctx.globalAlpha = 0.1 + pulseOffset * 0.2

        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }

      // Draw nodes with pulsing effect
      for (let i = 0; i < nodes.length; i++) {
        const pulseOffset = (Math.sin(time + i * 0.1) + 1) * 0.5
        ctx.globalAlpha = 0.3 + pulseOffset * 0.4
        nodes[i].draw()
      }

      ctx.globalAlpha = 1
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" style={{ pointerEvents: "none" }} />
}
