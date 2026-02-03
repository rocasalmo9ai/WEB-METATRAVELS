
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ExternalLink, ImageIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from './LanguageContext';
import { PACKAGES } from '../constants';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  groundingUrls?: { title: string; uri: string }[];
}

export const AIChatConcierge: React.FC = () => {
  const { language, getText, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    setMessages([{ 
      role: 'model', 
      text: t.concierge.welcome 
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, isGeneratingImage]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'model', text: t.concierge.errorKey }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const packagesContext = PACKAGES.map(p => ({
        id: p.id,
        title: getText(p.title),
        destination: getText(p.destination),
        price: `${p.price} ${p.currency}`,
        type: p.type
      }));

      const systemInstruction = `You are the Lead Travel Strategist for Meta Travels.
      Current Portfolio: ${JSON.stringify(packagesContext)}.
      Respond in ${language === 'es' ? 'Spanish' : 'English'}.
      Personality: Sophisticated, helpful, premium.
      Rules: Use GOOGLE SEARCH for real-time travel facts. Mention sources.`;

      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }]
          }
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage });
      const aiText = response.text || t.concierge.errorConn;
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const urls: { title: string; uri: string }[] = [];
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) urls.push({ title: chunk.web.title || 'Source', uri: chunk.web.uri });
        });
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiText, 
        groundingUrls: urls.length > 0 ? Array.from(new Set(urls.map(u => JSON.stringify(u)))).map(s => JSON.parse(s)) : undefined 
      }]);

      // Inteligencia Proactiva: ¿El usuario quiere "ver" algo?
      const keywords = ['ver', 'mira', 'foto', 'imagen', 'cómo es', 'look like', 'show me', 'picture', 'imagine'];
      if (keywords.some(k => userMessage.toLowerCase().includes(k))) {
        generateInspirationImage(userMessage, apiKey);
      }

    } catch (error) {
      console.error("Critical Failure:", error);
      setMessages(prev => [...prev, { role: 'model', text: t.concierge.busy }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInspirationImage = async (prompt: string, apiKey: string) => {
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A cinematic, ultra-luxury travel photograph of ${prompt}. 8k resolution, professional architectural photography style, elegant lighting.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      let base64Image = '';
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (base64Image) {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: language === 'es' ? 'Aquí tiene una visualización de su próximo destino:' : 'Here is a visualization of your next destination:',
          image: base64Image
        }]);
      }
    } catch (e) {
      console.warn("Image generation skipped", e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-3 group"
        >
          <div className="relative z-10 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap font-bold text-sm">
              {t.concierge.assistant}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent animate-pulse rounded-full"></div>
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-900 w-[92vw] sm:w-[420px] h-[600px] rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,1)] flex flex-col overflow-hidden border border-white/10 animate-slide-up">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white flex justify-between items-center shrink-0 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight">Meta Travels <span className="text-accent font-serif italic text-sm">Concierge</span></h3>
                <p className="text-[9px] opacity-70 uppercase tracking-[0.2em] font-bold flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Elite Intelligence
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0c10] custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-primary text-white' : 'bg-neutral-800 text-accent border border-white/5'}`}>
                    {m.role === 'user' ? <User size={14}/> : <Sparkles size={14}/>}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-xl ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-neutral-800 text-gray-200 border border-white/5 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                    {m.image && (
                      <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in aspect-video">
                        <img src={m.image} alt="Inspiration" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                           <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold flex items-center"><ImageIcon className="mr-2 w-3 h-3 text-accent"/> IA Generated View</span>
                        </div>
                      </div>
                    )}
                    {m.groundingUrls && (
                      <div className="flex flex-wrap gap-2">
                        {m.groundingUrls.map((u, idx) => (
                          <a key={idx} href={u.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-white/5 text-gray-400 hover:text-white border border-white/5 px-2 py-1 rounded-lg flex items-center gap-1 transition-all"><ExternalLink size={10} /> {u.title.substring(0, 15)}...</a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(isLoading || isGeneratingImage) && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 text-accent flex items-center justify-center border border-white/5"><Loader2 className="w-4 h-4 animate-spin" /></div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                    {isGeneratingImage ? 'Visualizando destino...' : 'Estrategizando...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-neutral-900 border-t border-white/10 flex gap-3">
            <input
              type="text"
              placeholder={t.concierge.place}
              className="flex-1 bg-neutral-800 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder-gray-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-accent hover:bg-accent-hover text-white p-4 rounded-2xl transition-all shadow-xl active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
