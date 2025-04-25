"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame, Canvas, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useInView } from "react-intersection-observer"

// Generate random points in a sphere
function generateRandomPoints(count: number, radius: number) {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    points[i3] = r * Math.sin(phi) * Math.cos(theta)
    points[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    points[i3 + 2] = r * Math.cos(phi)
  }
  return points
}

// Generate connections between points
function generateConnections(points: Float32Array, count: number, maxDistance: number) {
  const connections: [number, number][] = []
  const threshold = maxDistance * maxDistance

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x1 = points[i3]
    const y1 = points[i3 + 1]
    const z1 = points[i3 + 2]

    for (let j = i + 1; j < count; j++) {
      const j3 = j * 3
      const x2 = points[j3]
      const y2 = points[j3 + 1]
      const z2 = points[j3 + 2]

      const dx = x1 - x2
      const dy = y1 - y2
      const dz = z1 - z2
      const distSq = dx * dx + dy * dy + dz * dz

      if (distSq < threshold && connections.length < 300) {
        connections.push([i, j])
      }
    }
  }

  return connections
}

function BlockchainNodes({ count = 100, size = 0.02, scrollY = 0 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)
  const { viewport } = useThree()

  // Generate points
  const radius = Math.min(viewport.width, viewport.height) * 0.4
  const [positions] = useState(() => generateRandomPoints(count, radius))
  const [connections] = useState(() => generateConnections(positions, count, radius * 0.5))

  // Create lines geometry
  const [linesGeometry] = useState(() => {
    const geometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(connections.length * 6)

    connections.forEach((connection, i) => {
      const [pointA, pointB] = connection
      const i6 = i * 6
      const a3 = pointA * 3
      const b3 = pointB * 3

      linePositions[i6] = positions[a3]
      linePositions[i6 + 1] = positions[a3 + 1]
      linePositions[i6 + 2] = positions[a3 + 2]
      linePositions[i6 + 3] = positions[b3]
      linePositions[i6 + 4] = positions[b3 + 1]
      linePositions[i6 + 5] = positions[b3 + 2]
    })

    geometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    return geometry
  })

  // Animation
  useFrame((state) => {
    if (pointsRef.current && linesRef.current) {
      const time = state.clock.getElapsedTime() * 0.1

      // Rotate the entire system
      pointsRef.current.rotation.y = time * 0.2
      linesRef.current.rotation.y = time * 0.2

      // Pulse effect based on scroll
      const pulseIntensity = 1 + scrollY * 0.001
      const pulse = Math.sin(time * 2) * 0.05 * pulseIntensity + 0.95

      pointsRef.current.scale.set(pulse, pulse, pulse)
      linesRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#10B981"
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial
          attach="material"
          color="#10B981"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

function Scene({ scrollY }: { scrollY: number }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 5

  return <BlockchainNodes count={isMobile ? 50 : 100} size={isMobile ? 0.04 : 0.02} scrollY={scrollY} />
}

export default function BlockchainAnimation() {
  const [scrollY, setScrollY] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 z-0">
      {inView && (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ pointerEvents: "none" }} dpr={[1, 2]}>
          <Scene scrollY={scrollY} />
        </Canvas>
      )}
    </div>
  )
}
