import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface message {
  role: 'user' | 'assistant',
  content: string,
}

export default function Chatbox() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    if (!prompt) return;
    const fetchResponse = async () => {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: [...messages, { role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.output_text }]);
    };

    fetchResponse();
  }, [prompt]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const userMessage = e.currentTarget.value;
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setPrompt(userMessage);
      setValue('');
      console.log(messages);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user'
              ? 'text-white'
              : ''
              }`}>
              <Markdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <SyntaxHighlighter
                        style={tomorrow as any}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </Markdown>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <Input
          value={value}
          type="text"
          placeholder="What would you like to know?"
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={handleKeyPress}
        />
      </div>
    </div>
  )
}
