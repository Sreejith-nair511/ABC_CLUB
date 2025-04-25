"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Update active section based on scroll position
      const sections = ["about", "mission", "leadership", "upcoming", "get-involved"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md py-2 shadow-md border-b border-emerald-500/10" : "bg-transparent py-4",
      )}
    >
      <div className="container-width px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold group flex items-center">
          <img src="/images/abc-logo.png" alt="ABC Blockchain Club" className="h-8 md:h-10" />
          <span className="text-white ml-2 text-sm md:text-base sr-only">Blockchain Club</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-emerald-500 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks activeLink={activeLink} />
          <Button
            asChild
            variant="default"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-all duration-300"
          >
            <a href="#get-involved">Join the Movement</a>
          </Button>
        </nav>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg md:hidden border-b border-emerald-500/10"
            >
              <nav className="flex flex-col items-center py-6 space-y-6">
                <NavLinks onClick={closeMenu} activeLink={activeLink} />
                <Button
                  asChild
                  variant="default"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white w-4/5 shadow-md shadow-emerald-500/20"
                >
                  <a href="#get-involved" onClick={closeMenu}>
                    Join the Movement
                  </a>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function NavLinks({ onClick, activeLink }: { onClick?: () => void; activeLink?: string | null }) {
  return (
    <>
      <a
        href="#about"
        className={cn(
          "text-white hover:text-emerald-400 transition-colors relative group",
          activeLink === "about" && "text-emerald-400",
        )}
        onClick={onClick}
      >
        About
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-full",
            activeLink === "about" ? "w-full" : "w-0",
          )}
        ></span>
      </a>
      <a
        href="#mission"
        className={cn(
          "text-white hover:text-emerald-400 transition-colors relative group",
          activeLink === "mission" && "text-emerald-400",
        )}
        onClick={onClick}
      >
        Mission
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-full",
            activeLink === "mission" ? "w-full" : "w-0",
          )}
        ></span>
      </a>
      <a
        href="#leadership"
        className={cn(
          "text-white hover:text-emerald-400 transition-colors relative group",
          activeLink === "leadership" && "text-emerald-400",
        )}
        onClick={onClick}
      >
        Leadership
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-full",
            activeLink === "leadership" ? "w-full" : "w-0",
          )}
        ></span>
      </a>
      <a
        href="#upcoming"
        className={cn(
          "text-white hover:text-emerald-400 transition-colors relative group",
          activeLink === "upcoming" && "text-emerald-400",
        )}
        onClick={onClick}
      >
        Events
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-full",
            activeLink === "upcoming" ? "w-full" : "w-0",
          )}
        ></span>
      </a>
    </>
  )
}
