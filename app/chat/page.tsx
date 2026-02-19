'use client'

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { askChatbot } from '../actions/chat';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const result = await askChatbot(input);
    if (result.success) {
      setMessages(prev => [...prev, { role: 'bot', content: result.answer! }]);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">🐯 런치 브레인 AI 상담소</h1>
      <Card className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-white' : 'bg-muted'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-muted-foreground">호랑이가 고민 중... 어흥...</p>}
      </Card>
      <div className="flex gap-2">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="오늘 뭐 먹을까?" 
          onKeyDown={(e) => {
    // 🐯 [핵심] 한글 조합 중일 때는 엔터 이벤트가 두 번 실행되지 않도록 막습니다!
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      handleSend();
    }
  }}
        />
        <Button onClick={handleSend} disabled={loading}>전송</Button>
      </div>
    </div>
  );
}