"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Compass, BookOpen, Code } from "lucide-react"

export default function Mission() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const pillars = [
    {
      title: "Explore",
      description: "Dive into blockchain concepts, Web3 trends, and real-world applications.",
      icon: Compass,
      delay: 0.2,
    },
    {
      title: "Learn",
      description: "Host peer learning sessions, guest talks, and hands-on workshops.",
      icon: BookOpen,
      delay: 0.4,
    },
    {
      title: "Build",
      description: "Create and collaborate on simple decentralized applications and smart contracts.",
      icon: Code,
      delay: 0.6,
    },
  ]

  return (
    <section id="mission" className="section-padding bg-black/95 relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_50%)]"></div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
              Mission
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We're on a mission to demystify blockchain technology and build a community of innovators ready to shape the
            decentralized future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: pillar.delay }}
              className="bg-gradient-to-b from-black to-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 group shadow-lg shadow-emerald-900/5 backdrop-blur-sm"
            >
              <div className="bg-emerald-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-500/20 transition-all duration-300 shadow-inner shadow-emerald-500/10">
                <pillar.icon className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{pillar.title}</h3>
              <p className="text-gray-400">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
