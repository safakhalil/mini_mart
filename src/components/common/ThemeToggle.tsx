import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 sm:p-2.5 rounded-xl flex items-center gap-2 transition-all ${
        theme === 'dark'
          ? 'text-amber-400 hover:text-amber-300 bg-[#161B22] hover:bg-[#1F2530] border border-[#21262D]'
          : 'text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 border border-slate-200/80'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Theme Mode"
      id="theme-toggle-button"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
