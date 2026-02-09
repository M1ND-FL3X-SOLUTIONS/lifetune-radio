'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [credits, setCredits] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('onboarding-seen');
    if (!seen) setShowOnboarding(true);
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem('onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  const generateDailyMix = async () => {
    if (!isSignedIn) {
      alert('Sign in to generate your daily mix!');
      return;
    }
    if (credits <= 0) {
      alert('No credits left! Get more below 👇');
      return;
    }
    setIsGenerating(true);
    // Simulate generation
    await new Promise(r => setTimeout(r, 2000));
    setCurrentTrack('https://example.com/track.mp3');
    setCredits(c => c - 1);
    setIsGenerating(false);
  };

  const buyCredits = async () => {
    window.open('/api/stripe/checkout?priceId=day_pass', '_blank');
  };

  const openKoFi = () => {
    window.open(process.env.NEXT_PUBLIC_KOFI_URL || 'https://ko-fi.com', '_blank');
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border-2 border-[#00e5ff] p-6 max-w-md w-full">
            <h2 className="text-[#00e5ff] text-sm mb-4">WELCOME TO LIFETUNE 📻</h2>
            <div className="space-y-3 text-xs text-[#ffb347]/80 leading-relaxed">
              <p><span className="text-[#ff2d7b]">1.</span> Pick your favorite genres</p>
              <p><span className="text-[#ff2d7b]">2.</span> Set your daily mood</p>
              <p><span className="text-[#ff2d7b]">3.</span> Get AI-generated tracks daily</p>
            </div>
            <button 
              onClick={dismissOnboarding}
              className="mt-6 w-full bg-[#00e5ff] text-[#0a0a1a] py-2 text-xs hover:bg-[#00e5ff]/80"
            >
              START TUNING
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-lg md:text-2xl mb-4" style={{ fontFamily: 'var(--font-pixel)' }}>
          <span className="text-[#ff2d7b]">YOUR LIFE</span>
          <br />
          <span className="text-[#00e5ff]">TURNED INTO</span>
          <br />
          <span className="text-[#ffb347]">MUSIC 🎵</span>
        </h1>
        <p className="text-xs text-[#ffb347]/60 max-w-md mx-auto">
          AI-generated radio personalized to your taste.
          <br />
          Fresh tracks delivered daily.
        </p>
      </section>

      {/* Radio Player */}
      <section className="max-w-xl mx-auto mb-12">
        <div className="border-2 border-[#ffb347] p-4 bg-black/50">
          {/* Screen */}
          <div className="bg-[#1a1a2e] p-4 mb-4 font-mono text-xs">
            {isGenerating ? (
              <div className="text-[#00e5ff]">
                <span className="animate-pulse">GENERATING YOUR MIX...</span>
                <div className="mt-2 flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 bg-[#00e5ff] animate-bounce"
                      style={{ height: `${Math.random() * 24 + 8}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : currentTrack ? (
              <div className="text-[#ffb347]">
                ▶️ NOW PLAYING: YOUR DAILY MIX
                <audio controls className="w-full mt-2" src={currentTrack} />
              </div>
            ) : (
              <div className="text-[#ffb347]/50 py-8 text-center">
                📻 READY TO TUNE IN
              </div>
            )}
          </div>

          {/* Credits + Generate Button */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-xs">
              <span className="text-[#ffb347]/60">CREDITS:</span>{' '}
              <span className={credits > 0 ? 'text-[#00e5ff]' : 'text-[#ff2d7b]'}>
                {credits} {credits === 1 ? 'track' : 'tracks'} remaining
              </span>
            </div>
            <button
              onClick={generateDailyMix}
              disabled={isGenerating || credits <= 0}
              className={`px-6 py-2 text-xs border-2 ${
                credits > 0 
                  ? 'border-[#ffb347] bg-[#ffb347] text-[#0a0a1a] hover:bg-[#ffb347]/80' 
                  : 'border-[#ff2d7b] text-[#ff2d7b] cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'GENERATING...' : 'GENERATE DAILY MIX'}
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-center text-sm mb-6 text-[#00e5ff]">CHOOSE YOUR TIER</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Free */}
          <div className="border border-[#ffb347]/30 p-4 text-center">
            <h3 className="text-[#ffb347] text-xs mb-2">FREE</h3>
            <div className="text-2xl font-bold text-[#ffb347] mb-4">$0</div>
            <ul className="text-[10px] text-[#ffb347]/60 space-y-1 mb-4">
              <li>1 track per day</li>
              <li>1 station</li>
              <li>Basic genres</li>
            </ul>
            <button disabled className="w-full py-2 text-[10px] border border-[#ffb347]/30 text-[#ffb347]/30">
              CURRENT
            </button>
          </div>

          {/* Day Pass */}
          <div className="border-2 border-[#00e5ff] p-4 text-center relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00e5ff] text-[#0a0a1a] text-[10px] px-2">
              POPULAR
            </div>
            <h3 className="text-[#00e5ff] text-xs mb-2">DAY PASS</h3>
            <div className="text-2xl font-bold text-[#ffb347] mb-4">$5</div>
            <ul className="text-[10px] text-[#ffb347]/60 space-y-1 mb-4">
              <li>Unlimited today</li>
              <li>All features</li>
              <li>No subscription</li>
            </ul>
            <button 
              onClick={buyCredits}
              className="w-full py-2 bg-[#00e5ff] text-[#0a0a1a] text-[10px] hover:bg-[#00e5ff]/80"
            >
              GET DAY PASS
            </button>
          </div>

          {/* Pro Monthly */}
          <div className="border border-[#ff2d7b]/30 p-4 text-center">
            <h3 className="text-[#ff2d7b] text-xs mb-2">PRO MONTHLY</h3>
            <div className="text-2xl font-bold text-[#ffb347] mb-4">$7.99<span className="text-xs">/mo</span></div>
            <ul className="text-[10px] text-[#ffb347]/60 space-y-1 mb-4">
              <li>12 tracks/day</li>
              <li>3 stations</li>
              <li>Social sources</li>
            </ul>
            <button 
              onClick={() => alert('Monthly subscriptions coming soon!')}
              className="w-full py-2 border border-[#ff2d7b] text-[#ff2d7b] text-[10px] hover:bg-[#ff2d7b]/10"
            >
              COMING SOON
            </button>
          </div>
        </div>
      </section>

      {/* Tip Jar */}
      <section className="text-center max-w-md mx-auto">
        <h2 className="text-xs mb-4 text-[#ffb347]/60">SUPPORT THE STATION</h2>
        <div className="flex gap-2 justify-center mb-4">
          {[3, 5, 10].map(amount => (
            <a
              key={amount}
              href={process.env.NEXT_PUBLIC_KOFI_URL || 'https://ko-fi.com'}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 border border-[#ff2d7b] text-[#ff2d7b] text-xs hover:bg-[#ff2d7b]/10"
            >
              ${amount}
            </a>
          ))}
        </div>
        <button 
          onClick={openKoFi}
          className="text-[10px] text-[#ffb347]/40 hover:text-[#ffb347] underline"
        >
          or visit our Ko-fi page →
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[#ffb347]/20 text-center">
        <p className="text-[10px] text-[#ffb347]/40">
          Powered by ACE-Step 🎵 | Built with Next.js + Clerk + Supabase
        </p>
      </footer>
    </main>
  );
}
