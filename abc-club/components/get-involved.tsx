"use client"

import type React from "react"

import { useState } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

export default function GetInvolved() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    interest: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: "", email: "", interest: "" })
    }, 1500)
  }

  return (
    <section id="get-involved" className="section-padding bg-black relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_70%)]"></div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
              Involved
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join our community of blockchain enthusiasts and help shape the future of ABC Club. No prior experience
            needed—just bring your curiosity and enthusiasm!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          {isSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-8 text-center shadow-lg shadow-emerald-500/5 backdrop-blur-sm">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-gray-300">
                Your interest form has been submitted successfully. We'll be in touch soon with more information about
                joining ABC Blockchain Club.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 md:p-8 shadow-xl shadow-emerald-900/5 backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-emerald-500 text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-emerald-500 text-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-1">
                    Why are you interested in blockchain?
                  </label>
                  <Textarea
                    id="interest"
                    name="interest"
                    value={formState.interest}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-emerald-500 text-white min-h-[120px]"
                    placeholder="Tell us a bit about your interest in blockchain technology..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 btn-glossy"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Join the Movement"}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By submitting this form, you agree to receive communications from ABC Blockchain Club.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
