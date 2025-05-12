import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Stage 1: Initial fade in
    setAnimationStage(1);
    
    // Stage 2: Show tagline
    const taglineTimer = setTimeout(() => setAnimationStage(2), 800);
    
    // Stage 3: Show version and credit
    const versionTimer = setTimeout(() => setAnimationStage(3), 1400);
    
    // Final: Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationStage(4);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(versionTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div 
        className={`relative transition-all duration-500 ease-out ${
          animationStage === 0 ? 'opacity-0 scale-95' : 
          animationStage === 4 ? 'opacity-0 scale-105' : 
          'opacity-100 scale-100'
        }`}
      >
        {/* Logo and Brand Container */}
        <div className="relative flex flex-col items-center">
          {/* Animated Background Circle */}
          <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse" 
            style={{
              transform: 'scale(1.5)',
              filter: 'blur(40px)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          
          {/* Clock Icon with Rotating Ring */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500/30 animate-spin"
              style={{
                transform: 'scale(1.5)',
                animation: 'spin 4s linear infinite'
              }}
            />
            <Clock size={64} className="relative z-10 text-blue-500" strokeWidth={1.5} />
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl font-black tracking-tight text-white mb-4 relative">
            BackstagePro
            <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer" 
              style={{
                animation: 'shimmer 2s linear infinite',
                backgroundSize: '200% 100%'
              }}
            />
          </h1>

          {/* Tagline */}
          <p className={`text-lg text-blue-300/80 mb-2 transition-all duration-500 ${
            animationStage >= 2 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'
          }`}>
            Professional Event Timer
          </p>

          {/* Credit and Version Container */}
          <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
            animationStage >= 3 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'
          }`}>
            {/* By Serenity */}
            <div className="text-base text-blue-400/90 font-medium tracking-wide">
              by{' '}
              <span className="text-blue-300 font-semibold" 
                style={{
                  textShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                }}>
                SERENITY & GpCODE
              </span>
            </div>

            {/* Version Number */}
            <div className="text-sm text-slate-400 font-mono">
              Version 2.0.0
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700/50 overflow-hidden">
          <div 
            className="h-full bg-blue-500/50"
            style={{
              width: '30%',
              animation: 'loading 2s ease-in-out infinite',
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
      </div>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;