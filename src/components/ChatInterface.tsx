'use client';

import React, { useState, useRef, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { ChatMessage, ParseApiResponse } from '../types';
import { Scale, Send, Bot, User, Copy, Check, Share2, Download, ShieldCheck, AlertOctagon, RotateCcw, Award } from 'lucide-react';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Welcome to NLA & Partners! I'm your deterministic AI legal assistant. Tell me your deal details in plain English, and I'll extract the parameters into an immutable, SHA-256 verified boilerplate document so you can skip the surprise registry processing fees and endless paperwork. (Not Legal Advice • $NLA)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      label: '🚀 Acme & Nexus Delaware NDA',
      prompt: 'Draft a 3-year NDA between Acme Ventures Ltd and Nexus Tech Corp starting today to evaluate merger and acquisition opportunities under Delaware, USA law.',
    },
    {
      label: '⚡ Fintech API 2-Yr NDA',
      prompt: 'Draft a 2-year non-disclosure agreement between PayDirect Ltd and OpenBanking Inc to share API integration docs governed by England & Wales law.',
    },
    {
      label: '🛡️ Web3 Grant Singapore NDA',
      prompt: 'Draft a 5-year mutual NDA between 9Realms Studios and Base Ecosystem Fund for strategic grant evaluation under Singapore law.',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ai', prompt: textToSend.trim() }),
      });

      const data: ParseApiResponse = await res.json();
      const aiMsgId = `ai-${Date.now()}`;

      if (data.success && data.renderedText) {
        const aiMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          text: `I have extracted the deal parameters and drafted your standardized NDA boilerplate under ${data.data?.governingJurisdiction || 'Delaware, USA'} law:`,
          renderedText: data.renderedText,
          data: data.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const objectionMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          text: data.objection || 'OBJECTION! Request falls outside NLA & Partners legal template scope.',
          isObjection: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, objectionMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'OBJECTION! Network connection or processing error.',
        isObjection: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (renderedText: string) => {
    const element = document.createElement('a');
    const file = new Blob([renderedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `NLA_NDA_Boilerplate_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareToFarcaster = () => {
    const text = encodeURIComponent("Drafted an immutable, standardized NDA in seconds with NLA & Partners @9realms. In Boilerplate We Trust 📜✨ $NLA");
    const shareUrl = `https://warpcast.com/~/compose?text=${text}`;
    try {
      sdk.actions.openUrl(shareUrl);
    } catch (e) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'ai',
        text: "Welcome to NLA & Partners! I'm your deterministic AI legal assistant. Tell me your deal details in plain English, and I'll extract the parameters into an immutable, SHA-256 verified boilerplate document so you can skip the surprise registry processing fees and endless paperwork. (Not Legal Advice • $NLA)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="w-full max-w-full flex flex-col h-[560px] sm:h-[620px] glass-panel rounded-2xl border border-[#e2b714]/30 shadow-2xl overflow-hidden relative">
      {/* Top Header Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2.5">
          {/* Law Firm Seal / Mascot Badge */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e2b714] to-amber-300 flex items-center justify-center shadow-md shadow-[#e2b714]/20 border border-[#e2b714]/50 text-slate-950 shrink-0">
            <Scale className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-100 tracking-tight">NLA Legal AI Assistant</span>
              <span className="bg-[#e2b714]/15 text-[#e2b714] border border-[#e2b714]/40 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide">
                $NLA SUIT
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Deterministic Parameter Extractor</span>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-slate-400 hover:text-[#e2b714] p-1.5 rounded-lg hover:bg-slate-900 transition text-xs flex items-center space-x-1 font-semibold"
          title="Reset Chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main Chat Message Container - Independent Scroll */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 max-w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex space-x-2.5 max-w-full animate-fade-in ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* AI Avatar */}
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-[#e2b714]/40 flex items-center justify-center text-[#e2b714] shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {/* Message Bubble Container */}
            <div className={`flex flex-col space-y-2 max-w-[88%] sm:max-w-[82%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#e2b714]/15 border border-[#e2b714]/40 text-amber-100 rounded-tr-none shadow-[0_0_15px_rgba(226,183,20,0.08)]'
                    : msg.isObjection
                    ? 'bg-red-950/80 border border-red-500/40 text-red-200 rounded-tl-none font-semibold'
                    : 'bg-slate-900/90 border border-[#e2b714]/30 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {msg.isObjection && (
                  <div className="flex items-center space-x-1.5 text-red-400 mb-1 font-bold">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    <span>SCOPE OBJECTION</span>
                  </div>
                )}

                <p>{msg.text}</p>

                {/* Rendered Document Card inside AI Response */}
                {msg.renderedText && (
                  <div className="mt-3 bg-slate-950/90 border border-[#e2b714]/40 rounded-xl p-3.5 space-y-3 max-w-full overflow-hidden text-left font-mono shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-1.5 text-[10px] text-[#e2b714] font-bold tracking-wider">
                        <Award className="w-3.5 h-3.5" />
                        <span>MUTUAL NDA • {msg.data?.governingJurisdiction || 'Delaware, USA'}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                        SHA256 VERIFIED
                      </span>
                    </div>

                    <div className="text-[10px] sm:text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                      {msg.renderedText}
                    </div>

                    {/* Inline Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.renderedText!)}
                        className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition border border-slate-700"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied!' : 'Copy NDA'}</span>
                      </button>

                      <button
                        onClick={() => handleDownloadTxt(msg.renderedText!)}
                        className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5 text-[#e2b714]" />
                        <span>.TXT</span>
                      </button>

                      <button
                        onClick={handleShareToFarcaster}
                        className="flex items-center space-x-1 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-500/40 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition"
                      >
                        <Share2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Cast</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-500 px-1 font-medium">
                {msg.timestamp}
              </span>
            </div>

            {/* User Avatar */}
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#e2b714]/20 border border-[#e2b714]/40 flex items-center justify-center text-[#e2b714] shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-2.5 animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-[#e2b714]/40 flex items-center justify-center text-[#e2b714] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#e2b714] animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-[#e2b714] animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-[#e2b714] animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="text-xs text-slate-400 ml-1 font-medium">Extracting deal parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Section with Safe Padding pb-4 */}
      <div className="bg-slate-950/95 border-t border-slate-800/80 p-3 pb-4 space-y-2.5 shrink-0 z-10">
        {/* Suggestion Chips - Hidden Scrollbar & mb-3 Margin Spacing */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 mb-3 no-scrollbar">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(item.prompt)}
              className="bg-slate-900/90 hover:bg-[#e2b714]/15 border border-slate-800 hover:border-[#e2b714]/50 text-slate-300 hover:text-[#e2b714] px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition duration-200 shrink-0 shadow-sm"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom Input Area - Single Flex Row (gap-2) */}
        <div className="flex items-center gap-2 w-full max-w-full">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI assistant or paste deal context (e.g. 'Draft Delaware NDA between Acme and Nexus for 3 yrs')..."
            className="w-full flex-1 glass-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-normal max-h-24"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e2b714] via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-slate-950 font-bold flex items-center justify-center transition shadow-md shadow-[#e2b714]/20 disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4 fill-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
