import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import type { Language } from '../types';

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center bg-dark-secondary/80 rounded-md border border-dark-accent/20 shadow-sm overflow-hidden">
      <div className="pl-2 text-dark-muted">
        <FaGlobe size={14} />
      </div>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="py-1.5 pl-1 pr-7 border-0 bg-transparent text-dark-text focus:outline-none focus:ring-0 text-sm"
        aria-label={language === 'italian' ? 'Seleziona lingua' : 'Select language'}
      >
        <option value="italian">Italiano</option>
        <option value="english">English</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
