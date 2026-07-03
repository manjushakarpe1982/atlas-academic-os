'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Clock, Send, Trash2, MessageSquare, X, ChevronRight } from 'lucide-react';
import { TopicItem } from './shared';
import { API_BASE, getToken } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface Conversation {
  id: string;
  class_name: string;
  topic_title: string;
  last_message: string;
  message_count: number;
  updated_at: string;
}

interface Props {
  topic: TopicItem;
  className: string;
  classId: string;
  onBack: () => void;
}

const QUICK_QUESTIONS = [
  'Explain Simply',
  'Give Example',
  'Create MCQs',
  'Important Questions',
  'Explain in Hindi',
  'Exam Tips',
];

export default function AskAtlasAI({ topic, className, classId, onBack }: Props) {
  const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! 👋\nI'm Atlas AI. Ask me anything about **${topic.title}**. I'm here to help you learn better!`, time: now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Auto-save conversation
  const saveConversation = async (msgs: Message[], id: string | null) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/ai-conversations/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          conversation_id: id,
          messages: msgs.map(m => ({ role: m.role, content: m.content, time: m.time })),
          class_id: classId,
          class_name: className,
          topic_id: topic.id,
          topic_title: topic.title,
        }),
      });
      const data = await res.json();
      if (data.conversation_id && !id) setConvId(data.conversation_id);
    } catch {}
  };

  // Load conversation history
  const loadHistory = async () => {
    setShowHistory(true);
    setLoadingHistory(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/ai-conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data.conversations || []);
    } catch {} finally { setLoadingHistory(false); }
  };

  // Load a specific conversation
  const loadConversation = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/ai-conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.conversation?.messages) {
        setMessages(data.conversation.messages);
        setConvId(id);
        setShowHistory(false);
      }
    } catch {}
  };

  // Delete conversation
  const deleteConv = async (id: string) => {
    try {
      const token = getToken();
      await fetch(`${API_BASE}/api/classes/study/ai-conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(prev => prev.filter(c => c.id !== id));
      if (convId === id) {
        setConvId(null);
        setMessages([{ role: 'assistant', content: `Hi! 👋\nAsk me anything about **${topic.title}**.`, time: now() }]);
      }
    } catch {}
  };

  // New chat
  const newChat = () => {
    setConvId(null);
    setMessages([{ role: 'assistant', content: `Hi! 👋\nI'm Atlas AI. Ask me anything about **${topic.title}**. I'm here to help you learn better!`, time: now() }]);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim(), time: now() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const token = getToken();
      const conv = newMsgs.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE}/api/classes/study/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic: topic.title, class_name: className, messages: conv }),
      });
      const data = await res.json();
      const aiMsg: Message = { role: 'assistant', content: data.reply || 'Sorry, please try again.', time: now() };
      const finalMsgs = [...newMsgs, aiMsg];
      setMessages(finalMsgs);
      // Auto-save
      saveConversation(finalMsgs, convId);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', time: now() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const fmt = (text: string) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-xs font-mono">$1</code>')
    .replace(/\n/g, '<br/>');

  // History Panel
  if (showHistory) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(false)}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <h1 className="text-base font-extrabold text-gray-900">Chat History</h1>
          </div>
          <button onClick={newChat}
            className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">No saved conversations</p>
              <p className="text-xs text-gray-300 mt-1">Your chats will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(c => (
                <div key={c.id}
                  className={`bg-white border rounded-xl p-3 flex items-center gap-3 hover:border-indigo-200 transition-all cursor-pointer ${convId === c.id ? 'border-indigo-400 bg-indigo-50/30' : 'border-gray-200'}`}>
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => loadConversation(c.id)}>
                    <p className="text-sm font-bold text-gray-900 truncate">{c.topic_title}</p>
                    <p className="text-xs text-gray-500 truncate">{c.last_message || 'No messages'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400">{c.class_name}</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">{c.message_count} msgs</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">{timeAgo(c.updated_at)}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteConv(c.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <div>
              <h1 className="text-base font-extrabold text-gray-900">Ask Atlas AI</h1>
              <p className="text-xs text-gray-400">{topic.title}</p>
            </div>
          </div>
          <button onClick={loadHistory} className="relative">
            <Clock className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Topic Banner */}
      <div className="mx-4 mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <span className="text-lg">📘</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Topic: {topic.title}</p>
            <p className="text-[11px] text-gray-500">{className}</p>
          </div>
        </div>
        <button onClick={onBack} className="text-xs font-bold text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100">
          Change Topic
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1">
                <img src="https://res.cloudinary.com/mview/image/upload/atlas/askatlasai.webp" alt="AI" className="w-8 h-8 rounded-full object-cover" />
              </div>
            )}
            <div className={`max-w-[80%] ${m.role === 'user'
              ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-2.5'
              : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-2.5'}`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: fmt(m.content) }} />
              <p className={`text-[10px] mt-1.5 flex items-center gap-1 ${m.role === 'user' ? 'text-indigo-200 justify-end' : 'text-gray-400'}`}>
                {m.time} {m.role === 'user' && '✓✓'}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1">
              <img src="https://res.cloudinary.com/mview/image/upload/atlas/askatlasai.webp" alt="AI" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="px-4 pb-2">
        <p className="text-xs font-bold text-gray-500 mb-2">Quick Questions</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => sendMessage(`${q} about ${topic.title}`)}
              disabled={loading}
              className="text-[13px] font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder={`Ask anything about ${topic.title}...`}
            disabled={loading}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 flex-shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">Atlas AI can make mistakes. Please verify important information.</p>
      </div>
    </div>
  );
}
