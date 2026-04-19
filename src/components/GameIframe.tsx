'use client';

import { useState, useRef, useEffect } from 'react';

interface GameIframeProps {
  src: string;
  title: string;
  image?: string;
}

export default function GameIframe({ src, title, image }: GameIframeProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreenToggle = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gray-900 shadow-lg ${isFullscreen ? 'h-screen' : 'aspect-video rounded-lg'
        }`}
    >
      {!hasStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
          {image && (
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm pointer-events-none" />
          )}

          <button
            onClick={() => setHasStarted(true)}
            className="relative z-30 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.5)] transform transition-transform hover:scale-105 flex items-center gap-3 text-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Play Game
          </button>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white z-10 transition-opacity duration-300">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-cyan-400 font-medium">Loading Game...</p>
            </div>
          )}

          <iframe
            src={src}
            title={title}
            className="w-full h-full min-h-[400px] border-0 relative z-0"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            allowFullScreen
          />
        </>
      )}

      {/* Fullscreen control overlay */}
      <button
        onClick={handleFullscreenToggle}
        className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-md backdrop-blur-sm transition-all z-20 group"
        aria-label="Toggle Fullscreen"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>
    </div>
  );
}
