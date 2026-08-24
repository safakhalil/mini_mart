import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md', showTagline = false }) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 relative transition-transform duration-200 group-hover:scale-105`}
      >
        <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
        <div className="absolute -bottom-0.5 -right-0.5 bg-[#0E1116] rounded-full p-0.5 border border-white/20">
          <Clock className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isDark ? 'text-[#0E1116]' : 'text-white'
            }`}
          >
            24<span className="text-emerald-500">/</span>7
          </span>
          <span
            className={`font-bold tracking-tight ${textSizes[size]} ${
              isDark ? 'text-slate-800' : 'text-slate-100'
            }`}
          >
            MART
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-600 mt-0.5">
            Your Everyday Essentials. Anytime.
          </span>
        )}
      </div>
    </div>
  );
};
