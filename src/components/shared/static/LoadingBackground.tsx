"use client";

import React from "react";

interface LoadingBackgroundProps {
  children: React.ReactNode;
}

export default function LoadingBackground({ children }: LoadingBackgroundProps) {
  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white selection:bg-green-300">
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6">
        S Z
      </div>
      {children}
    </div>
  );
}