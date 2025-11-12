'use client';

import { useEffect, useState, useRef } from 'react';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  redirectUrl: string;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // fetch active banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners/active', { cache: 'no-store' });
        const data = await res.json();
        setBanners(data.banners || []);
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // auto-rotate every 5s (pause on hover)
  useEffect(() => {
    if (!banners.length || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners, paused]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const handleClick = async (banner: Banner) => {
    try {
      await fetch('/api/banners/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id }),
      });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
    window.open(banner.redirectUrl, '_blank');
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg">
        <div className="h-64 w-full bg-neutral-800/60 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="h-6 w-48 bg-neutral-700/70 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!banners.length) return null;

  const active = banners[current];

  return (
    <div
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        aria-label="Previous banner"
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 px-3 py-2 rounded-lg bg-black/50 text-white backdrop-blur hover:bg-black/70 transition pointer-events-auto"
      >
        ‹
      </button>

      <button
        aria-label="Next banner"
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 px-3 py-2 rounded-lg bg-black/50 text-white backdrop-blur hover:bg-black/70 transition pointer-events-auto"
      >
        ›
      </button>

      <div
        className="cursor-pointer bg-black flex items-center justify-center h-40 sm:h-48 md:h-56"
        onClick={() => handleClick(active)}
      >
        <img
          src={active.imageUrl}
          alt={active.title}
          className="max-h-full w-auto object-contain"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center p-2 text-lg">
          {active.title}
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === current ? 'w-6 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
