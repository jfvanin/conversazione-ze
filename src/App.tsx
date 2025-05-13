import { useState } from 'react';
import Chat from './components/Chat';
import type { Language } from './types';
import './App.css';

function App() {
  const [language, setLanguage] = useState<Language>('italian');

  return (
    <div className="app-container">
      <div className="h-full max-w-5xl mx-auto w-full flex flex-col">
        <Chat language={language} setLanguage={setLanguage} />
      </div>
    </div>
  );
}

export default App;
