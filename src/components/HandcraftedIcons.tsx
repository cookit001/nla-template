import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function Seal2DIcon({ className = 'w-6 h-6', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="9" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1.5" />
      <polygon points="12,4 14.5,9.5 20,9.5 15.5,13.5 17.5,19 12,15.5 6.5,19 8.5,13.5 4,9.5 9.5,9.5" fill="#D4AF37" />
    </svg>
  );
}

export function Document2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" fill="#1E1F20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="14" y2="16" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Quill2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M20.24 3.76C18 1.52 14.28 1.83 11 4.5C8 7 6 10.5 5 14L3 21L10 19C13.5 18 17 16 19.5 13C22.17 9.72 22.48 6 20.24 3.76Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8L8 16" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Shield2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" fill="#1E1F20" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Code2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Layers2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="2 17 12 22 22 17" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="2 12 12 17 22 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Scale2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="12" y1="3" x2="12" y2="21" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="7" x2="20" y2="7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 7L2 14H6L4 7Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 7L18 14H22L20 7Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="21" x2="15" y2="21" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Menu2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="3" y1="6" x2="21" y2="6" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="18" x2="15" y2="18" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Plus2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" stroke="#E3E3E3" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="#E3E3E3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Clock2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="9" stroke="#C4C7C5" strokeWidth="1.5" />
      <polyline points="12 7 12 12 15 15" stroke="#C4C7C5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkles2DIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#D4AF37" />
    </svg>
  );
}

export function Send2DIcon({ className = 'w-4 h-4', size }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" stroke="#0A0D14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#0A0D14" stroke="#0A0D14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
