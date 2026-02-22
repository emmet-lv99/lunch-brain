'use client'

import ChatMessage from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { askChatbot } from '../actions/chat';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, {role: 'user', content: input}]);
    setInput('');
    setLoading(true);

    const result = await askChatbot(input);
    if (result.success) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer! }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* 🐯 헤더: 모바일 앱 느낌의 상단 바 */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
           <span className="p-1.5 bg-blue-100 rounded-lg text-lg">🐯</span>
           런치 브레인 AI
        </h1>
        <div className="flex items-center gap-1.5">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* 🐯 메시지 영역: 스크롤 최적화 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2 transition-all">
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                </div>
                <span className="text-[11px] font-bold text-slate-400">호랑이가 생각 중...</span>
             </div>
          </div>
        )}
      </div>

      {/* 🐯 입력창: 도킹된 하단 입력 바 */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pb-safe">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 focus-within:shadow-md focus-within:bg-white transition-all duration-300">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="어떤 음식이 땡기나 어흥?" 
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-11 px-4 placeholder:text-slate-400"
            onKeyDown={(e) => {
              // 🐯 [핵심] 한글 조합 중일 때는 엔터 이벤트가 두 번 실행되지 않도록 막습니다!
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button 
             onClick={handleSend} 
             disabled={loading}
             className="rounded-xl h-11 w-11 p-0 bg-blue-600 hover:bg-blue-700 shadow-md shrink-0 transition-transform active:scale-90"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}