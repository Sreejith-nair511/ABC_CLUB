"use client"

import { useRef, useEffect } from "react"

export default function NodeHoverEffect() {
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
      velocity: { x: number; y: number }
      opacity: number
      targetOpacity: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 2 + 1
        this.color = "#10B981"
        this.velocity = {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3,
        }
        this.opacity = 0.1 + Math.random() * 0.2
        this.targetOpacity = this.opacity
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y

        // Bounce off edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.velocity.x = -this.velocity.x
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.velocity.y = -this.velocity.y
        }

        // Smooth opacity transition
        this.opacity += (this.targetOpacity - this.opacity) * 0.1

        this.draw()
      }
    }

    // Create nodes
    const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100)
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      nodes.push(new Node(x, y))
    }

    // Handle mouse movement
    const mouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      radius: 100,
    }

    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    canvas.addEventListener("mouseleave", () => {
      mouse.x = undefined
      mouse.y = undefined
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 0.3

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = (1 - distance / 150) * 0.15
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Update nodes and check for hover
      for (const node of nodes) {
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = node.x - mouse.x
          const dy = node.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            node.targetOpacity = 0.8
          } else {
            node.targetOpacity = 0.1 + Math.random() * 0.2
          }
        } else {
          node.targetOpacity = 0.1 + Math.random() * 0.2
        }

        node.update()
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" style={{ pointerEvents: "none" }} />
}
