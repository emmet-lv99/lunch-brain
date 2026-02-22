'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // shadcn 기본 utils
import { ExternalLink, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4 shadow-sm",
          isAssistant 
            ? "bg-white border border-slate-200 text-slate-800" 
            : "bg-blue-600 text-white"
        )}
      >
        <div className="prose prose-sm max-w-none break-words">
          <ReactMarkdown
            components={{
              // 🐯 마크다운의 'a' 태그(링크)를 커스텀 버튼으로 치환
              a: ({ href, children }) => {
                const isKakaoMap = href?.startsWith('https://map.kakao.com');

                if (isKakaoMap) {
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center mx-1 my-1 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 h-8 text-xs font-bold gap-1.5 transition-colors shadow-sm"
                      onClick={() => window.open(href, '_blank')}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {children}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </Button>
                  );
                }

                // 일반 외부 링크 처리
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline underline-offset-4"
                  >
                    {children}
                  </a>
                );
              },
              // 가독성을 위해 단락(p) 간격 조정
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              // 강조(bold) 스타일
              strong: ({ children }) => <span className="font-bold text-slate-900">{children}</span>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}