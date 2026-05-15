'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatButton() {
  const handleClick = () => {
    window.open('https://m.me/553491717858025', '_blank');
  };

  return (
    <button onClick={handleClick} className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 transition-all z-50 group">
      <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
}
