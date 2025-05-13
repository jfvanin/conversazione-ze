import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaRobot } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import type { Message, Language } from '../types';
import { AudioRecorder } from '../services/AudioService';
import { transcribeAudio, generateChatResponse } from '../services/OpenAIService';
import LanguageSwitcher from './LanguageSwitcher';
import MessageBubble from './MessageBubble';

interface ChatProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const Chat: React.FC<ChatProps> = ({ language, setLanguage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    if (isLoading) return;
    
    const messageContent = text || input;
    if (!messageContent.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Add all messages to create context for the AI
      const allMessages = [...messages, userMessage];
      
      // Get response from OpenAI
      const response = await generateChatResponse(allMessages, language);
      
      // Add the assistant response to messages
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        role: 'assistant',
        timestamp: new Date(),
        audioUrl: response.audioUrl
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-play the response audio
      playAudio(response.audioUrl);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(language === 'italian' 
        ? 'Errore nell\'elaborazione del messaggio. Per favore, riprova.' 
        : 'Error processing message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordAudio = async () => {
    if (isRecording) {
      setIsLoading(true);
      try {
        // Stop recording and get the audio blob
        const { audioBlob } = await audioRecorder.current.stopRecording();
        setIsRecording(false);
        
        // Transcribe the audio
        const transcription = await transcribeAudio(audioBlob, language);
        
        // Send the transcribed message
        await handleSendMessage(transcription);
      } catch (err) {
        console.error('Error recording audio:', err);
        setError(language === 'italian'
          ? 'Errore nell\'elaborazione dell\'audio. Per favore, riprova.'
          : 'Error processing audio. Please try again.');
        setIsRecording(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        // Start recording
        await audioRecorder.current.startRecording();
        setIsRecording(true);
        setError(null);
      } catch (err) {
        console.error('Error starting recording:', err);
        setError(language === 'italian'
          ? 'Impossibile avviare la registrazione. Controlla i permessi del microfono.'
          : 'Failed to start recording. Please check microphone permissions.');
      }
    }
  };

  const handleCancelRecording = () => {
    if (isRecording) {
      audioRecorder.current.cancelRecording();
      setIsRecording(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="border-b border-dark-accent/20 bg-dark-primary/90 py-3 px-4 sm:px-6 flex justify-between items-center shadow-sm sticky top-0 z-10 blur-backdrop">
        <h1 className="text-lg sm:text-xl font-semibold text-dark-highlight">
          {language === 'italian' ? 'Conversazione di Zé' : 'Zé`s Conversation'}
        </h1>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
      
      {/* Main chat area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-dark-muted">
            <div className="w-16 h-16 mb-6 rounded-full bg-dark-accent/10 flex items-center justify-center">
              <FaMicrophone className="text-dark-highlight text-2xl" />
            </div>
            <h2 className="text-center mb-3 text-xl sm:text-2xl font-medium text-dark-text">
              {language === 'italian' 
                ? 'Benvenuto al tuo assistente di conversazione in italiano!' 
                : 'Welcome to your English conversation assistant!'}
            </h2>
            <p className="text-center max-w-lg">
              {language === 'italian'
                ? 'Digita un messaggio o usa il microfono per iniziare la conversazione. Questa app ti aiuta a praticare l\'italiano o l\'inglese.'
                : 'Type a message or use the microphone to start the conversation. This app helps you practice Italian or English.'}
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} playAudio={playAudio} language={language} />
            ))}
            {isLoading && (
              <div className="py-5 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-dark-accent text-dark-text">
                    <FaRobot size={14} />
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-dark-accent/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-dark-accent/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-dark-accent/70 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-dark-highlight/10 border-l-4 border-dark-highlight text-dark-text p-3 mx-4 sm:mx-6 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-dark-accent/20 bg-dark-primary/90 px-4 sm:px-6 py-4 sticky bottom-0 z-10 blur-backdrop">
        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-start h-32 gap-2 bg-dark-secondary/90 rounded-xl shadow-lg border border-dark-accent/30">
            {isRecording ? (
              <>
                <button
                  onClick={handleRecordAudio}
                  disabled={isLoading}
                  className="p-4 rounded-full bg-dark-highlight hover:bg-dark-highlight/80 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 m-3"
                  title={language === 'italian' ? "Invia registrazione" : "Send recording"}
                >
                  <IoMdSend size={20} />
                </button>
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="px-6 py-3 rounded-lg bg-dark-accent/20 text-dark-text flex items-center">
                    <span className="animate-pulse mr-3 h-3 w-3 bg-dark-highlight rounded-full"></span>
                    <span className="text-base">{language === 'italian' ? "Registrazione in corso..." : "Recording..."}</span>
                  </div>
                </div>
                <button
                  onClick={handleCancelRecording}
                  disabled={isLoading}
                  className="p-4 rounded-full bg-dark-accent/80 hover:bg-dark-accent text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 m-3"
                  title={language === 'italian' ? "Annulla registrazione" : "Cancel recording"}
                >
                  <span className="text-sm">{language === 'italian' ? "Annulla" : "Cancel"}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRecordAudio}
                  disabled={isLoading}
                  className="p-4 rounded-full bg-dark-accent/80 hover:bg-dark-accent text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 m-3 self-center"
                  title={language === 'italian' ? "Registra audio" : "Record audio"}
                >
                  <FaMicrophone size={18} />
                </button>
                
                <div className="flex-1 relative py-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={language === 'italian' ? "Scrivi il tuo messaggio..." : "Type your message..."}
                    disabled={isRecording || isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    className="w-full h-24 p-3 border-0 bg-transparent text-dark-text placeholder-dark-muted focus:outline-none resize-none"
                    style={{ minHeight: "80px" }}
                  />
                </div>
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading || isRecording}
                  className="p-4 bg-dark-highlight text-white rounded-full hover:bg-dark-highlight/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 m-3 self-center"
                  title={language === 'italian' ? "Invia messaggio" : "Send message"}
                >
                  <IoMdSend size={18} />
                </button>
              </>
            )}
          </div>
          <div className="text-xs text-dark-muted mt-2 text-center">
            {language === 'italian' 
              ? 'Conversazione ti aiuta a praticare lingua straniera tramite chat e audio' 
              : 'Conversazione helps you practice foreign language through chat and audio'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
