'use client';

import { Search, TrendingUp, Users, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/player/${searchQuery}`;
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 object-cover w-full h-full opacity-30 z-0"
      >
        {/*
          IMPORTANT: Place your video file (e.g., hero-bg.mp4) in the `public/videos` directory.
          The path will then be `/videos/hero-bg.mp4`.
        */}
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black opacity-60 z-10" />

      {/* Content wrapper */}
      <div className="relative z-20 container mx-auto px-4 py-20 flex flex-col justify-center items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-wide uppercase font-['Oswald']">
            PUBG:BATTLEGROUNDS STATS
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-8 font-['Archivo_Narrow']">
            Track your performance, analyze your gameplay, dominate the battleground.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Soldier's Handle... (e.g., shroud)"
                className="w-full px-6 py-4 pr-16 text-lg rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 shadow-xl shadow-black/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors duration-300"
              >
                <Search className="w-6 h-6 text-neutral-950" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 mt-3 font-['Archivo_Narrow']">
              Try: shroud, chocoTaco, TGLTN
            </p>
          </form>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Performance"
            description="Track K/D, win rate, and damage over time"
            delay={0.2}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Team Stats"
            description="View clan performance and member rankings"
            delay={0.4}
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Leaderboards"
            description="See top 500 players per season"
            delay={0.6}
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Match History"
            description="Detailed analysis of recent matches"
            delay={0.8}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-neutral-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-neutral-500">
          <p>© 2024 BATTLEGROUNDS STATS. Powered by official PUBG API.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <div className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-2 h-full flex flex-col">
        <div className="flex items-center justify-center rounded-lg bg-yellow-500 text-neutral-950 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase font-['Oswald'] tracking-wider">{title}</h3>
        <p className="text-neutral-400 font-['Archivo_Narrow']">{description}</p>
      </div>
    </motion.div>
  );
}
