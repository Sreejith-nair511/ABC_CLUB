"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="section-padding bg-black relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_50%)]"></div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
              About
            </span>{" "}
            Us
          </h2>

          <div className="space-y-6 text-gray-300">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ABC Club at CIT is a student-led Algorand Blockchain Club dedicated to fostering innovation, learning, and
              collaboration in blockchain technology.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We aim to educate, engage, and empower students with hands-on experience through workshops, hackathons,
              and real-world projects.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Whether you're a beginner or an expert, ABC Club provides a platform to explore decentralized technologies
              and build the future of Web3.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-block p-px bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50 rounded-lg shadow-lg shadow-emerald-500/20">
              <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg">
                <p className="text-emerald-400 italic">
                  "We're not just studying the technology of tomorrow—we're building it today."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
