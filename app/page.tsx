'use client';

import { Search, TrendingUp, Users, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AirdropViewer from '@/components/AirdropModel';


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
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-30 bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-500 font-['Oswald'] tracking-wider">
            STAT ARENA
          </h1>
        </div>
      </header>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 z-0" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(115, 115, 115) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content wrapper - MOVED UP IN Z-INDEX */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 flex flex-col justify-center items-center pointer-events-none">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl pointer-events-auto"
        >
          <h1
            className="
              text-3xl sm:text-4xl md:text-6xl lg:text-7xl
              font-bold text-white mb-6
              tracking-tight uppercase
              font-['Oswald']
              leading-[1.02] md:leading-tight
              max-w-full
              px-4
              break-words
              text-center
            "
          >
            PUBG: BATTLEGROUNDS STATS
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
          </form>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pointer-events-auto">
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

      {/* 3D Models on Left and Right - MOVED TO HIGHER Z-INDEX */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* Left 3D Model */}
        <div 
          className="hidden lg:block absolute left-4 lg:left-8 top-[180px] w-[200px] lg:w-[220px] h-[260px] lg:h-[280px] pointer-events-auto" 
        >
          <AirdropViewer />
        </div>

        {/* Right 3D Model */}
        <div 
          className="hidden lg:block absolute right-4 lg:right-8 top-[180px] w-[200px] lg:w-[220px] h-[260px] lg:h-[280px] pointer-events-auto" 
        >
          <AirdropViewer />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-30 border-t border-neutral-800 mt-20 py-8 pointer-events-auto">
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
        <div className="flex items-center justify-center rounded-lg bg-yellow-500 text-neutral-950 mb-4 w-12 h-12">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase font-['Oswald'] tracking-wider">{title}</h3>
        <p className="text-neutral-400 font-['Archivo_Narrow']">{description}</p>
      </div>
    </motion.div>
  );
}