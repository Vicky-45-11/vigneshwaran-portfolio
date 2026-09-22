import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Play, RefreshCw } from 'lucide-react';

export const AiTextDetectorShowcase: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSample, setActiveSample] = useState<'sample1' | 'sample2'>('sample1');

  const samples = {
    sample1: {
      text: "The convergence of artificial intelligence and systems engineering necessitates modular neural frameworks capable of scalable heuristic processing across decentralized nodes.",
      detectedAs: "AI-Generated",
      score: "High Confidence",
      metrics: {
        perplexity: "Low Variance",
        burstiness: "Uniform Token Distribution",
        linguisticScore: "Synthetic Coherence",
      },
      isAi: true,
    },
    sample2: {
      text: "I spent three days debugging a stubborn memory leak in our database connection pool. Turned out we forgot to release idle clients back to the pool under heavy request loads.",
      detectedAs: "Human-Written",
      score: "High Confidence",
      metrics: {
        perplexity: "High Variance",
        burstiness: "Organic Sentence Lengths",
        linguisticScore: "Natural Stylometry",
      },
      isAi: false,
    },
  };

  const currentData = samples[activeSample];

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B0B0B] border border-white/[0.1] p-5 sm:p-6 overflow-hidden relative shadow-2xl">
      {/* Top pipeline step tracker */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-white font-semibold">NLP PIPELINE SIMULATOR</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-blue-400">INPUT</span>
          <span>→</span>
          <span className="text-cyan-400">PATTERNS</span>
          <span>→</span>
          <span className="text-indigo-400">CLASSIFICATION</span>
        </div>
      </div>

      {/* Sample Switcher Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono text-[#71717A]">Test Case:</span>
        <button
          onClick={() => setActiveSample('sample1')}
          className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
            activeSample === 'sample1'
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-white/5 text-[#A1A1AA] hover:text-white'
          }`}
        >
          Sample 1 (Synthetic)
        </button>
        <button
          onClick={() => setActiveSample('sample2')}
          className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
            activeSample === 'sample2'
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-white/5 text-[#A1A1AA] hover:text-white'
          }`}
        >
          Sample 2 (Natural)
        </button>
      </div>

      {/* Text Box */}
      <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.06] text-xs sm:text-sm font-mono text-[#A1A1AA] leading-relaxed mb-5 relative">
        <span className="absolute top-2 right-2 text-[10px] text-[#71717A] uppercase font-mono">
          Input Text Buffer
        </span>
        {currentData.text}
      </div>

      {/* Interactive Trigger */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono tracking-wider font-semibold transition-all disabled:opacity-50 shadow-md shadow-blue-600/25"
        >
          {analyzing ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>PROCESSING LINGUISTIC VECTORS...</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>RUN REAL-TIME CLASSIFICATION</span>
            </>
          )}
        </button>

        <span className="text-[11px] font-mono text-[#71717A] hidden sm:inline">
          Confidence Scoring System
        </span>
      </div>

      {/* Results Pipeline Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
          <span className="block text-[10px] font-mono text-[#71717A] uppercase mb-1">
            Token Perplexity
          </span>
          <span className="text-xs font-mono text-[#F5F5F5] font-semibold">
            {analyzing ? 'Computing...' : currentData.metrics.perplexity}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
          <span className="block text-[10px] font-mono text-[#71717A] uppercase mb-1">
            Burstiness Ratio
          </span>
          <span className="text-xs font-mono text-[#F5F5F5] font-semibold">
            {analyzing ? 'Evaluating...' : currentData.metrics.burstiness}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
          <span className="block text-[10px] font-mono text-[#71717A] uppercase mb-1">
            Classification Result
          </span>
          <div className="flex items-center gap-1.5">
            {currentData.isAi ? (
              <AlertCircle size={14} className="text-cyan-400" />
            ) : (
              <CheckCircle2 size={14} className="text-emerald-400" />
            )}
            <span
              className={`text-xs font-mono font-bold ${
                currentData.isAi ? 'text-cyan-400' : 'text-emerald-400'
              }`}
            >
              {analyzing ? 'Analyzing...' : currentData.detectedAs}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
