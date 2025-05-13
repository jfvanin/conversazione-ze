export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    audioUrl?: string;
}

export interface Conversation {
    id: string;
    messages: Message[];
    language: 'italian' | 'english';
}

export type Language = 'italian' | 'english';
