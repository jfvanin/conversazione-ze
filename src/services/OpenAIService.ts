import OpenAI from 'openai';
import type { Message, Language } from '../types';

// Create an OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // For frontend use - in production, proxying through a backend is recommended
});

export async function transcribeAudio(audioBlob: Blob, language: Language): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');

        const response = await openai.audio.transcriptions.create({
            file: new File([audioBlob], 'audio.webm', { type: 'audio/webm' }),
            model: 'whisper-1',
            prompt: `Transcribe this audio to text in ${language === 'italian' ? 'italiano' : 'inglês'}`,
        });

        return response.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw new Error('Failed to transcribe audio. Please try again.');
    }
}

export async function generateChatResponse(messages: Message[], language: Language): Promise<{ text: string; audioUrl: string }> {
    try {
        // Convert our messages to OpenAI format
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Add a system message with instructions
        const systemMessage = {
            role: 'system',
            content: `Você é um assistente de conversação para ajudar um falante brasileiro de português a praticar ${language === 'italian' ? 'italiano' : 'inglês'
                }. 
      
      Responda SEMPRE em ${language === 'italian' ? 'italiano' : 'inglês'}.
      
      Após cada resposta do usuário:
      1. Se houver erros gramaticais, de vocabulário ou de pronúncia na mensagem do usuário, 
         corrija-os usando o próprio ${language === 'italian' ? 'italiano' : 'inglês'}, de forma educada e explicativa.
      2. Se a frase estiver perfeita, elogie brevemente em ${language === 'italian' ? 'italiano' : 'inglês'}.
      3. Em seguida, continue a conversa respondendo ao conteúdo da mensagem do usuário em ${language === 'italian' ? 'italiano' : 'inglês'
                }.
      
      Mantenha suas respostas concisas, naturais e adequadas ao nível de um estudante intermediário.
      Não use português em suas respostas - explique tudo em ${language === 'italian' ? 'italiano' : 'inglês'}, 
      usando frases simples e claras para que o estudante possa compreender.`
        };

        // Get text response
        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [systemMessage, ...formattedMessages],
            temperature: 0.7,
        });

        const responseText = chatResponse.choices[0]?.message?.content ||
            (language === 'italian' ? 'Mi dispiace, non sono riuscito a generare una risposta.' : 'Sorry, I couldn\'t generate a response.');

        // Generate audio for the response
        const audioResponse = await openai.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice: language === 'italian' ? 'alloy' : 'nova',
            input: responseText,
        });

        // Convert the audio buffer to a URL
        const audioBlob = await audioResponse.arrayBuffer();
        const audioUrl = URL.createObjectURL(new Blob([audioBlob], { type: 'audio/mpeg' }));

        return { text: responseText, audioUrl };
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error(language === 'italian'
            ? 'Errore nella generazione della risposta. Per favore, riprova.'
            : 'Failed to generate response. Please try again.');
    }
}
