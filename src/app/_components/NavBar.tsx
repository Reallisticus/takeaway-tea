"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mobile design - we'll use a completely different approach for mobile
  const [isMobile, setIsMobile] = useState(false);

  // --- SVG Shape Configuration Constants ---
  const svgDesignViewportWidth = 1440;
  const navRectHeight = 64;

  // Responsive values based on screen width
  const [dimensions, setDimensions] = useState({
    ellipseRx: 120,
    ellipseRy: 56,
    logoWidth: 240,
    logoHeight: 100,
    ellipseStartX: 840,
    ellipseEndX: 600,
    leftBezierX1: 865,
    leftBezierX2: 865,
    rightBezierX1: 575,
    rightBezierX2: 575,
    leftEndX: 890,
    rightEndX: 550,
  });

  const ellipseTopYCoord = 84;
  const svgCalculatedTotalHeight = ellipseTopYCoord + dimensions.ellipseRy;

  // Update dimensions and check if we're on mobile
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      // Set mobile flag for small screens
      setIsMobile(width < 768);

      // Default/Desktop values (> 1024px)
      let newDimensions = {
        ellipseRx: 120,
        ellipseRy: 56,
        logoWidth: 240,
        logoHeight: 100,
        ellipseStartX: 840,
        ellipseEndX: 600,
        leftBezierX1: 865,
        leftBezierX2: 865,
        rightBezierX1: 575,
        rightBezierX2: 575,
        leftEndX: 890,
        rightEndX: 550,
      };

      // Tablet values (768px - 1024px)
      if (width <= 1024 && width > 768) {
        newDimensions = {
          ellipseRx: 100,
          ellipseRy: 56,
          logoWidth: 200,
          logoHeight: 90,
          ellipseStartX: 820,
          ellipseEndX: 620,
          leftBezierX1: 845,
          leftBezierX2: 845,
          rightBezierX1: 595,
          rightBezierX2: 595,
          leftEndX: 870,
          rightEndX: 570,
        };
      }

      // Mobile gets different dimensions when using the ellipse design
      if (width <= 768) {
        newDimensions = {
          ellipseRx: 100,
          ellipseRy: 50,
          logoWidth: 160,
          logoHeight: 80,
          ellipseStartX: 720,
          ellipseEndX: 720,
          leftBezierX1: 720,
          leftBezierX2: 720,
          rightBezierX1: 720,
          rightBezierX2: 720,
          leftEndX: 720,
          rightEndX: 720,
        };
      }

      setDimensions(newDimensions);
    }

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when pathname changes or when clicking outside
  useEffect(() => {
    setIsMenuOpen(false);
    const handleClickOutside = (e: { target: any }) => {
      const target = e.target;
      if (
        !target.closest(".navbar-content-wrapper") &&
        !target.closest(".hamburger-btn") &&
        !target.closest(".mobile-menu-content")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname]);

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
    },
  };

  // Custom path with responsive coordinates
  const newNavbarPath = `M 0 0 L 1440 0 L 1440 64 L ${dimensions.leftEndX} 64 C ${dimensions.leftBezierX1},64 ${dimensions.leftBezierX2},84 ${dimensions.ellipseStartX},84 A ${dimensions.ellipseRx} ${dimensions.ellipseRy} 0 1 0 ${dimensions.ellipseEndX},84 C ${dimensions.rightBezierX1},84 ${dimensions.rightBezierX2},64 ${dimensions.rightEndX},64 L 0 64 Z`;

  // Enhanced text styling for restaurant theme - modern, sleek approach
  const navLinkBaseStyle =
    "relative font-sans text-sm tracking-widest transition-all duration-300 uppercase font-light";
  const navLinkActiveStyle = "text-black";
  const navLinkInactiveStyle = "text-gray-500 hover:text-black";

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full">
      {!isMobile ? (
        // Desktop and tablet design with ellipse
        <>
          {/* SVG Background Shape Container */}
          <div
            className="absolute inset-x-0 top-0"
            style={{ height: `${svgCalculatedTotalHeight}px`, zIndex: 1 }}
          >
            <motion.svg
              viewBox={`0 0 ${svgDesignViewportWidth} ${svgCalculatedTotalHeight}`}
              preserveAspectRatio="xMidYMin meet"
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
            >
              {/* Main path for the navbar shape */}
              <motion.path
                d={newNavbarPath}
                initial={false}
                animate={{
                  fill: "rgba(255, 255, 255, 1)",
                }}
                transition={{ duration: 0.3 }}
                className={"drop-shadow-lg"}
              />
            </motion.svg>
          </div>

          {/* Navigation Content Wrapper */}
          <div
            className="navbar-content-wrapper relative z-20 container mx-auto px-4"
            style={{ height: `${navRectHeight}px` }}
          >
            <div className="flex h-full items-center justify-between">
              {/* Left side - Delivery link */}
              <motion.div
                className="hidden flex-1 justify-end lg:flex"
                style={{ paddingRight: `${dimensions.ellipseRx + 40}px` }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href="/"
                  className={`${navLinkBaseStyle} ${
                    pathname === "/" ? navLinkActiveStyle : navLinkInactiveStyle
                  }`}
                >
                  <motion.span
                    whileHover={{
                      y: -3,
                      x: -2,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    className="inline-block"
                  >
                    ДОСТАВКА
                  </motion.span>
                  {pathname === "/" && (
                    <motion.span
                      className="absolute -bottom-1 left-1/2 h-[1px] w-5 -translate-x-1/2 bg-black"
                      layoutId="nav-underline"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Center - Logo Image */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 transform"
                style={{
                  width: `${dimensions.ellipseRx * 2}px`,
                  height: `${svgCalculatedTotalHeight}px`,
                  zIndex: 30,
                }}
              >
                <motion.div
                  className="flex h-full w-full flex-col items-center justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/" className="block">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="/logo-dark.svg"
                        alt="Лого на компанията"
                        width={dimensions.logoWidth}
                        height={dimensions.logoHeight}
                        priority
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Right side - Catering link */}
              <motion.div
                className="hidden flex-1 justify-start lg:flex"
                style={{ paddingLeft: `${dimensions.ellipseRx + 40}px` }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href="/catering"
                  className={`${navLinkBaseStyle} ${
                    pathname === "/catering"
                      ? navLinkActiveStyle
                      : navLinkInactiveStyle
                  }`}
                >
                  <motion.span
                    whileHover={{
                      y: -3,
                      x: 2,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    className="inline-block"
                  >
                    КЕТЪРИНГ
                  </motion.span>
                  {pathname === "/catering" && (
                    <motion.span
                      className="absolute -bottom-1 left-1/2 h-[1px] w-5 -translate-x-1/2 bg-black"
                      layoutId="nav-underline-catering"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Tablet hamburger button */}
              <div className="flex flex-1 justify-end lg:hidden">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="hamburger-btn relative z-40 flex h-12 w-12 flex-col items-center justify-center rounded-full focus:outline-none"
                  aria-label={isMenuOpen ? "Затвори менюто" : "Отвори менюто"}
                  whileHover={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.span
                    className={`block h-0.5 w-5 bg-black`}
                    animate={
                      isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className={`mt-1.5 block h-0.5 w-5 bg-black`}
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className={`mt-1.5 block h-0.5 w-5 bg-black`}
                    animate={
                      isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Mobile design - simple flat navbar
        <div className="relative w-full bg-white shadow-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            {/* Mobile Logo - centered */}
            <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="block">
                <Image
                  src="/logo.svg"
                  alt="Лого на компанията"
                  width={dimensions.logoWidth}
                  height={dimensions.logoHeight}
                  priority
                />
              </Link>
            </div>

            {/* Spacer to keep logo centered */}
            <div className="invisible w-10"></div>

            {/* Mobile hamburger button - right aligned */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hamburger-btn relative z-40 flex h-12 w-12 flex-col items-center justify-center rounded-full focus:outline-none"
              aria-label={isMenuOpen ? "Затвори менюто" : "Отвори менюто"}
              whileHover={{
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                className={`block h-0.5 w-5 bg-black`}
                animate={
                  isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className={`mt-1.5 block h-0.5 w-5 bg-black`}
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className={`mt-1.5 block h-0.5 w-5 bg-black`}
                animate={
                  isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-content absolute top-0 right-0 left-0 z-10 mx-2 mt-1 rounded-lg border bg-white shadow-xl lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            style={{
              paddingTop: isMobile
                ? "70px"
                : `${svgCalculatedTotalHeight + 8}px`,
              borderColor: "rgb(229 231 235)",
            }}
          >
            <nav className="flex flex-col gap-2 px-4 pt-5 pb-6">
              {[
                { title: "ДОСТАВКА", path: "/" },
                { title: "КЕТЪРИНГ", path: "/catering" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative block rounded-md px-4 py-3 text-center font-sans text-base font-light tracking-widest uppercase transition-colors ${
                      pathname === item.path
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {item.title}
                    {pathname === item.path && (
                      <motion.span
                        className="absolute bottom-1 left-1/2 h-[1px] w-5 -translate-x-1/2 bg-black"
                        layoutId={`mobile-underline-${item.title}`}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
