import { Github, Twitter, Code2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
      setCurrentDate(now.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="w-full flex justify-between items-center p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-start sm:items-center">
          <p className="text-zinc-700 text-sm font-mono digital-clock">
            {currentTime}
          </p>
          <p className="text-zinc-500 text-xs mt-1">
            {currentDate}
          </p>
        </div>
        <div className="flex gap-2.5">
          <a 
            href="https://github.com/kevinnadar22/ChillGuyCreator" 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title="View Source"
          >
            <Code2 className="w-5 h-5 text-zinc-700" />
          </a>
          <a 
            href="https://github.com/kevinnadar22" 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title="GitHub"
          >
            <Github className="w-5 h-5 text-zinc-700" />
          </a>
          <a
            href="https://twitter.com/kvnn22"
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Twitter"
          >
            <Twitter className="w-5 h-5 text-zinc-700" />
          </a>
        </div>
      </header>
      
      <footer className="fixed bottom-0 left-0 right-0 text-center p-4 text-sm text-zinc-500 bg-white/80 backdrop-blur-sm border-t border-zinc-100">
        Made by <a 
          href="https://github.com/kevinnadar22" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
        >
          Kevin
        </a>
      </footer>
    </>
  );
} 