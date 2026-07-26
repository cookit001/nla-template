'use client';

import React from 'react';
import {
  Seal2DIcon,
  Document2DIcon,
  Quill2DIcon,
  Shield2DIcon,
  Code2DIcon,
  Layers2DIcon,
  Plus2DIcon,
  Scale2DIcon,
  Clock2DIcon,
} from './HandcraftedIcons';
import { Sun, Moon, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { LegalDocumentType } from '../types';

interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeDocType: LegalDocumentType;
  onSelectDocType: (type: LegalDocumentType) => void;
  onNewDocument: () => void;
  onOpenTos: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function GeminiSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activeDocType,
  onSelectDocType,
  onNewDocument,
  onOpenTos,
  theme,
  onToggleTheme,
}: Props) {
  const templates: { id: LegalDocumentType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'nda', label: 'Mutual NDA', desc: 'Non-Disclosure Agreement', icon: <Quill2DIcon className="w-4 h-4" /> },
    { id: 'sow', label: 'Statement of Work', desc: 'SOW Development Deal', icon: <Code2DIcon className="w-4 h-4" /> },
    { id: 'advisory', label: 'Web3 Advisory (TAGA)', desc: 'Token Advisory Grant', icon: <Shield2DIcon className="w-4 h-4" /> },
    { id: 'contractor', label: 'Contractor Deal (ICSA)', desc: 'Services & IP Transfer', icon: <Document2DIcon className="w-4 h-4" /> },
    { id: 'safe', label: 'SAFE-T Capital', desc: 'Future Equity / Token', icon: <Layers2DIcon className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-3 select-none">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Sidebar Header & Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2.5">
            <Seal2DIcon className="w-7 h-7 drop-shadow-sm shrink-0" />
            {!collapsed && (
              <div>
                <div className="text-sm font-bold tracking-tight text-slate-100 whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
                  NLA Templates
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4af37]">
                    Gemini v2.5 Engine
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={onCloseMobile}
            className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* "+ New Document" Gemini Pill Button */}
        <button
          onClick={onNewDocument}
          className={`w-full bg-[#28292a] hover:bg-[#3c4043] border border-slate-700/60 text-slate-100 font-semibold rounded-full transition-all flex items-center shadow-sm ${
            collapsed ? 'p-2.5 justify-center' : 'px-4 py-2.5 gap-2.5 justify-start'
          }`}
          title="New Legal Document"
        >
          <Plus2DIcon className="w-4 h-4 shrink-0 text-[#d4af37]" />
          {!collapsed && <span className="text-xs whitespace-nowrap">New Document</span>}
        </button>

        {/* Chat History & Legal Template Catalog */}
        <div className="space-y-1 pt-2">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Chat History & Tools</span>
              <Clock2DIcon className="w-3 h-3 text-slate-500" />
            </div>
          )}

          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                onSelectDocType(tpl.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center rounded-xl transition-all ${
                collapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-2.5 text-left'
              } ${
                activeDocType === tpl.id
                  ? 'bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]'
                  : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
              }`}
              title={tpl.label}
            >
              <div className="shrink-0">{tpl.icon}</div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">{tpl.label}</div>
                  <div className="text-[9px] text-slate-500 truncate">{tpl.desc}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-2 pt-3 border-t border-slate-800/60">
        {/* TOS Trigger Link */}
        <button
          onClick={onOpenTos}
          className={`w-full flex items-center text-slate-400 hover:text-slate-200 transition-colors rounded-xl ${
            collapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-2.5 text-xs font-medium'
          }`}
          title="TOS & Legal Disclaimer"
        >
          <Scale2DIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
          {!collapsed && <span className="truncate">TOS & Disclaimer</span>}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center text-slate-400 hover:text-slate-200 transition-colors rounded-xl ${
            collapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-2.5 text-xs font-medium'
          }`}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          {!collapsed && <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
        </button>

        {!collapsed && (
          <div className="px-2 text-[9px] text-slate-500 font-medium text-center pt-1">
            © 2026 9Realms Studios
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Gemini Sidebar */}
      <aside
        className={`hidden sm:flex flex-col bg-[#1e1f20] border-r border-slate-800/80 h-screen sticky top-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-72 bg-[#1e1f20] border-r border-slate-800 h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
