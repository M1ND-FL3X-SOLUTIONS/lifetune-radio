'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="border-2 border-[#00e5ff] p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="text-[#00e5ff] text-sm mb-4">PAYMENT SUCCESSFUL!</h1>
        <p className="text-[#ffb347]/80 text-xs mb-6">
          Your Day Pass is now active. Generate unlimited tracks for the next 24 hours!
        </p>
        <div className="text-[10px] text-[#ffb347]/40 mb-4">
          Session: {sessionId?.slice(0, 16)}...
        </div>
        <p className="text-[10px] text-[#ffb347]/60">
          Redirecting you home in 5 seconds...
        </p>
      </div>
    </main>
  );
}
