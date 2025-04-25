"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Linkedin, Github, Mail } from "lucide-react"

export default function Leadership() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="leadership" className="section-padding bg-gradient-to-b from-black to-gray-950 relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_70%)]"></div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Leadership{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
              Spotlight
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">Meet the visionary behind ABC Blockchain Club</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden shadow-xl shadow-emerald-900/5 backdrop-blur-sm"
        >
          <div className="relative h-64 w-full">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <img src="/images/abc-logo.png" alt="ABC Blockchain Club Logo" className="h-32 w-auto" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

            {/* Glowing accent */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-emerald-500/10 filter blur-3xl"></div>
          </div>

          <div className="p-6 text-center relative">
            <h3 className="text-2xl font-bold mb-1">Misbah</h3>
            <p className="text-emerald-500 mb-4">Founding Lead</p>

            <blockquote className="italic text-gray-300 mb-6">
              "Blockchain is more than tech — it's a mindset. It's about reimagining systems, questioning centralized
              authority, and building a more equitable digital future."
            </blockquote>

            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
