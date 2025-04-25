"use client"

import Link from "next/link"
import { Linkedin, MessageSquare, Instagram } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-gray-800 py-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05)_0,rgba(0,0,0,0)_70%)]"></div>

      <div className="container-width px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-0 text-center md:text-left"
          >
            <Link href="/" className="text-2xl font-bold mb-2 inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
                ABC
              </span>
              <span className="text-white ml-2 text-sm md:text-base">Blockchain Club</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Building Blocks for the Decentralized Future. An initiative by the ISE Department.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end"
          >
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/abc.cit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-2 hover:bg-emerald-500/10 rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/algorand-blockchain-club-cit-88051935a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-2 hover:bg-emerald-500/10 rounded-full"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://chat.whatsapp.com/JhZgBn8nIx48pOpDMFf841"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-2 hover:bg-emerald-500/10 rounded-full"
                aria-label="WhatsApp"
              >
                <MessageSquare size={20} />
              </a>
            </div>
            <p className="text-gray-500 text-sm">© {currentYear} ABC Blockchain Club. All rights reserved.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-500 text-xs">Made with 💚 by students, for students.</p>
        </motion.div>
      </div>
    </footer>
  )
}
