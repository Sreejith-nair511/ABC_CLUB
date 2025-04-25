"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Calendar, Users, Lightbulb } from "lucide-react"

export default function UpcomingActivities() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const activities = [
    {
      title: "Blockchain Basics Workshop",
      description: "An introductory session on blockchain fundamentals and use cases.",
      icon: Lightbulb,
      status: "Coming Soon",
      delay: 0.2,
    },
    {
      title: "Community Meetup",
      description: "Meet fellow blockchain enthusiasts and discuss the latest trends.",
      icon: Users,
      status: "Launching Soon",
      delay: 0.4,
    },
    {
      title: "Hackathon Planning",
      description: "Help us plan our first mini-hackathon focused on decentralized applications.",
      icon: Calendar,
      status: "In Planning",
      delay: 0.6,
    },
  ]

  return (
    <section id="upcoming" className="section-padding bg-gradient-to-b from-gray-950 to-black relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_70%)]"></div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
              Activities
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We're currently planning our first events and activities. Stay tuned for updates!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: activity.delay }}
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 shadow-lg shadow-emerald-900/5 backdrop-blur-sm"
            >
              <div className="bg-emerald-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-inner shadow-emerald-500/10">
                <activity.icon className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{activity.title}</h3>
              <p className="text-gray-400 mb-4">{activity.description}</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
