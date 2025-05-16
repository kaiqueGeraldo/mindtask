"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-[#051026]">
      <motion.h1
        className={`text-8xl font-bold text-[#113A8C]`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-2xl text-gray-400 mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Ops! Página não encontrada.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6"
      >
        <Link href="/">
          <button
            className="py-3 px-6 flex gap-2 items-center bg-[#113A8C] rounded-lg text-white font-semibold transition-all duration-300 hover:bg-[#113A8C]/80 shadow-lg hover:scale-105 cursor-pointer"
            aria-label="Voltar para o início"
          >
            <ArrowLeft size={18} /> Voltar para o início
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
