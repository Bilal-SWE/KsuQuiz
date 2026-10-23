'use client';

import { useState } from 'react';

export function ImageZoom({ src, className = '' }: { src: string; className?: string }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <img
        src={src}
        alt=""
        onClick={() => setZoomed(true)}
        className={`max-h-48 rounded-lg cursor-zoom-in object-contain ${className}`}
      />
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomed(false)}
        >
          <img
            src={src}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
}
