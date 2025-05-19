"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GoogleReviews } from "./GoogleReviews";

export function Hero() {
  return (
    <div className="relative -top-24 h-screen w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pizza.webp" // This would be your high-quality food image
          alt="Вкусна пица с разтопено сирене и топинги"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto flex h-full items-center px-4 pt-24 sm:pt-36 md:px-6 lg:px-8">
        <div className="max-w-lg md:max-w-xl lg:max-w-2xl">
          <motion.h1
            className="font-sans text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Вкусна храна, <br />
            <span className="font-normal">доставена до вашата врата</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-gray-200 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Пресни съставки, автентични рецепти и бърза доставка директно до
            вашия дом или офис.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/menu">
              <motion.button
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-white px-8 py-4 text-lg font-medium text-orange-800 transition-all duration-300 ease-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-orange-500 to-orange-700 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
                <span className="relative z-10 flex items-center space-x-2 transition-colors duration-300 ease-out group-hover:text-white">
                  <span>Вижте нашето меню</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </motion.button>
            </Link>

            <Link href="/specials">
              <motion.button
                className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-4 text-lg font-light text-white transition-all duration-300 ease-out hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Днешни специалитети
              </motion.button>
            </Link>
          </motion.div>

          {/* Trustpilot-like badges or delivery info */}
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-orange-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span className="text-sm text-gray-200">Доставка за 30 мин</span>
            </div>

            <GoogleReviews
              placeId="ChIJMWaFEQCfpkARndTVNrp8LBQ"
              className="text-white"
            />

            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-orange-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <span className="text-sm text-gray-200">
                Безплатна доставка за поръчки над 40 лв
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Order Now Floating Button */}
      <motion.div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform sm:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link href="/menu">
          <button className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-3 text-white shadow-lg">
            <span>Поръчай сега</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
