import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function ScrollArrows() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (y) => window.scrollTo({ top: y, behavior: 'smooth' });

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <button
        onClick={() => scrollTo(0)}
        className="bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full p-3 shadow-lg transition"
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="w-6 h-6" />
      </button>

      <button
        onClick={() => scrollTo(document.body.scrollHeight)}
        className="bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full p-3 shadow-lg transition"
        aria-label="Scroll to bottom"
      >
        <ChevronDownIcon className="w-6 h-6" />
      </button>
    </div>
  );
}