import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc3 } from 'lucide-react';

export const SpotifyCloneShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  const playlist = [
    { title: 'Synthetic Ambient', artist: 'Lo-Fi AI Waves', duration: '2:45' },
    { title: 'Deep Heuristic', artist: 'Neural Beats', duration: '3:12' },
    { title: 'Algorithmic Flow', artist: 'Focus Soundscapes', duration: '4:05' },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B0B0B] border border-white/[0.1] p-5 sm:p-6 overflow-hidden relative shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <Disc3 size={15} className={`text-emerald-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-white font-semibold">WEB AUDIO & STREAMING INTERFACE</span>
        </div>
        <span className="text-emerald-400">Interactive Player UI</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Album Art / Visualizer (5 cols) */}
        <div className="sm:col-span-5 rounded-xl bg-[#141414] border border-white/[0.06] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3 group-hover:scale-105 transition-transform">
            <Music size={32} className="text-white" />
          </div>

          <h4 className="text-xs font-bold text-[#F5F5F5] truncate max-w-full">
            {playlist[activeTrack].title}
          </h4>
          <span className="text-[10px] font-mono text-[#71717A]">
            {playlist[activeTrack].artist}
          </span>

          {/* Animated Equalizer Waveform */}
          <div className="flex items-end justify-center gap-1 h-8 mt-3 w-full">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 65, 80].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`] : '20%',
                }}
                transition={{
                  duration: 0.7,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: 'reverse',
                  delay: i * 0.05,
                }}
                className="w-1.5 rounded-full bg-emerald-500/80"
              />
            ))}
          </div>
        </div>

        {/* Playlist & Controls (7 cols) */}
        <div className="sm:col-span-7 flex flex-col justify-between h-full space-y-3">
          {/* Playlist Items */}
          <div className="space-y-1.5">
            {playlist.map((track, idx) => (
              <div
                key={track.title}
                onClick={() => {
                  setActiveTrack(idx);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs font-mono ${
                  activeTrack === idx
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-white font-semibold'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] text-[#A1A1AA]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] text-[#71717A] w-4">0{idx + 1}</span>
                  <span className="truncate">{track.title}</span>
                </div>
                <span className="text-[10px] text-[#71717A]">{track.duration}</span>
              </div>
            ))}
          </div>

          {/* Timeline Bar */}
          <div className="pt-2">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-emerald-400 rounded-full transition-all duration-300 ${
                  isPlaying ? 'w-2/3' : 'w-1/4'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#71717A] mt-1">
              <span>{isPlaying ? '1:24' : '0:35'}</span>
              <span>{playlist[activeTrack].duration}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveTrack((prev) => (prev > 0 ? prev - 1 : playlist.length - 1))}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Previous Track"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/30 transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTrack((prev) => (prev < playlist.length - 1 ? prev + 1 : 0))}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Next Track"
            >
              <SkipForward size={16} />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[#71717A]">
              <Volume2 size={14} />
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
