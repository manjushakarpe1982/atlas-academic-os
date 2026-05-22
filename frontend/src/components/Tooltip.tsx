'use client';
import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  text: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
}

export default function Tooltip({ text, children, position = 'top', width = 'w-52' }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setVisible(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const posClass = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  const arrowClass = {
    top:    'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
    left:   'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
    right:  'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
  }[position];

  return (
    <div ref={ref} className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}>
      {children ?? (
        <button type="button" aria-label="Help"
          className="w-4 h-4 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0">
          <HelpCircle className="w-3 h-3 text-gray-400 hover:text-indigo-500" />
        </button>
      )}
      {visible && (
        <div className={`absolute z-50 ${posClass}`} role="tooltip">
          <div className={`${width} bg-gray-800 text-white text-xs font-medium leading-relaxed px-3 py-2 rounded-xl shadow-xl`}>
            {text}
          </div>
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClass}`} />
        </div>
      )}
    </div>
  );
}
