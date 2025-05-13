import React from 'react';
import { FaPlay, FaUser, FaRobot } from 'react-icons/fa';
import type { Message, Language } from '../types';

interface MessageBubbleProps {
  message: Message;
  playAudio: (url: string) => void;
  language: Language;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, playAudio, language }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`py-5 ${isUser ? 'bg-transparent' : 'bg-dark-secondary/30'} border-b border-dark-accent/10`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-4">
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-dark-highlight text-white' : 'bg-dark-accent text-dark-text'}`}>
          {isUser ? <FaUser size={14} /> : <FaRobot size={14} />}
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-semibold mb-1">
            {isUser ? (language === 'italian' ? 'Tu' : 'You') : 'Conversazione AI'}
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
          </div>
          {message.audioUrl && !isUser && (
            <button 
              onClick={() => playAudio(message.audioUrl!)}
              className="mt-3 text-sm flex items-center gap-2 py-1.5 px-3 rounded-md bg-dark-accent/20 text-dark-text hover:bg-dark-accent/30 transition-colors duration-200"
              title={language === 'italian' ? "Riproduci audio" : "Play audio"}
            >
              <FaPlay size={10} /> {language === 'italian' ? "Ascolta" : "Listen"}
            </button>
          )}
          <div className="text-xs text-dark-muted mt-2">
            {new Intl.DateTimeFormat(language === 'italian' ? 'it-IT' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
