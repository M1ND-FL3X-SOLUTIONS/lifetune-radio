'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

// Real ACE-Step API endpoint
const API_URL = process.env.NEXT_PUBLIC_RADIO_API_URL || 'https://m1ndb0t-2045--intergalactic-music-festival-radio-api.modal.run';

// Station presets (from Warroom V2)
const PRESETS = [
  { name: 'TRIBAL RESONANCE', freq: '88.1', caption: 'tribal electronic ambient bass-heavy world-music', genre: 'tribal', bpm: 95 },
  { name: 'NEURAL DRIFT', freq: '91.7', caption: 'deep ambient neural atmospheric ethereal', genre: 'ambient', bpm: 70 },
  { name: 'CYBER PULSE', freq: '96.3', caption: 'cyberpunk synthwave dark electronic driving', genre: 'electronic', bpm: 128 },
  { name: 'QUANTUM BASS', freq: '101.5', caption: 'dubstep bass wobble electronic heavy', genre: 'dubstep', bpm: 140 },
  { name: 'VOID LOUNGE', freq: '104.9', caption: 'lo-fi chill jazz atmospheric smooth night', genre: 'lo-fi', bpm: 80 },
  { name: 'STELLAR GROOVE', freq: '108.3', caption: 'house disco funk electronic upbeat groove', genre: 'house', bpm: 122 },
  { name: 'DEEP SPACE', freq: '92.5', caption: 'deep techno minimal dark hypnotic industrial', genre: 'techno', bpm: 132 },
  { name: 'MEDITATION', freq: '89.0', caption: 'meditation calm peaceful healing spiritual church', genre: 'meditation', bpm: 60 },
];

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [credits, setCredits] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('STANDBY — READY TO TRANSMIT');
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [trackHistory, setTrackHistory] = useState<Array<{url: string, preset: string, time: string}>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const seen = localStorage.getItem('lifetune-onboarding-seen');
    if (!seen) setShowOnboarding(true);
    
    // Load saved credits
    const saved = localStorage.getItem('lifetune-credits');
    if (saved) setCredits(parseInt(saved));
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem('lifetune-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  const generateTrack = async () => {
    if (!isSignedIn) {
      alert('Sign in to generate your daily mix!');
      return;
    }
    if (credits <= 0) return;

    setIsGenerating(true);
    setGenerationStatus('SYNTHESIZING TRANSMISSION...');

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedPreset.caption,
          duration: 60,
          bpm: selectedPreset.bpm,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (data.audio_base64) {
        // Convert base64 to blob URL
        const binary = atob(data.audio_base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);

        setCurrentTrack(url);
        setGenerationStatus(`NOW PLAYING: ${selectedPreset.name}`);
        setTrackHistory(prev => [{url, preset: selectedPreset.name, time: new Date().toLocaleTimeString()}, ...prev.slice(0, 9)]);

        const newCredits = credits - 1;
        setCredits(newCredits);
        localStorage.setItem('lifetune-credits', String(newCredits));

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().catch(() => {});
        }
      } else if (data.audio_url) {
        setCurrentTrack(data.audio_url);
        setGenerationStatus(`NOW PLAYING: ${selectedPreset.name}`);
        setTrackHistory(prev => [{url: data.audio_url, preset: selectedPreset.name, time: new Date().toLocaleTimeString()}, ...prev.slice(0, 9)]);

        const newCredits = credits - 1;
        setCredits(newCredits);
        localStorage.setItem('lifetune-credits', String(newCredits));

        if (audioRef.current) {
          audioRef.current.src = data.audio_url;
          audioRef.current.play().catch(() => {});
        }
      } else {
        throw new Error('No audio in response');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerationStatus(`ERROR: ${err.message || 'Generation failed'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      {/* Hidden audio element for MediaSession / background playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border-2 border-[#00e5ff] p-6 max-w-md w-full">
            <h2 className="text-[#00e5ff] text-sm mb-4 tracking-widest">⚡ WELCOME TO LIFETUNE RADIO</h2>
            <div className="space-y-3 text-xs text-[#ffb347]/80 leading-relaxed">
              <p><span className="text-[#ff2d7b]">01.</span> Select a frequency preset below</p>
              <p><span className="text-[#ff2d7b]">02.</span> Hit GENERATE to synthesize your track</p>
              <p><span className="text-[#ff2d7b]">03.</span> AI creates unique music in real-time</p>
              <p><span className="text-[#ff2d7b]">04.</span> Upgrade for unlimited daily transmissions</p>
            </div>
            <p className="text-[10px] text-[#ffb347]/40 mt-4">
              ⚠ All music is AI-generated. No human artists were harmed.
            </p>
            <button
              onClick={dismissOnboarding}
              className="mt-6 w-full bg-[#00e5ff] text-[#0a0a1a] py-3 text-xs hover:bg-[#00e5ff]/80 tracking-widest"
            >
              START TUNING
            </button>
          </div>
        </div>
      )}

      {/* How To Modal */}
      {showHowTo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border-2 border-[#ffb347] p-6 max-w-lg w-full">
            <h2 className="text-[#ffb347] text-sm mb-4 tracking-widest">📻 HOW IT WORKS</h2>
            <div className="space-y-4 text-xs text-[#ffb347]/80">
              <div className="border border-[#00e5ff]/30 p-3">
                <strong className="text-[#00e5ff]">1. Choose a Frequency</strong>
                <p>Each preset tunes into a different genre — from tribal bass to neural ambient to deep techno.</p>
              </div>
              <div className="border border-[#00e5ff]/30 p-3">
                <strong className="text-[#00e5ff]">2. Generate</strong>
                <p>Our AI (ACE-Step) synthesizes a unique track in real-time. No two transmissions are the same.</p>
              </div>
              <div className="border border-[#00e5ff]/30 p-3">
                <strong className="text-[#00e5ff]">3. Listen & Collect</strong>
                <p>Play your generated tracks, build a collection, and share your favorites.</p>
              </div>
              <div className="border border-[#ff2d7b]/30 p-3">
                <strong className="text-[#ff2d7b]">Credits</strong>
                <p>Free tier: 3 tracks/day. Day Pass ($5): unlimited for 24h. Pro ($7.99/mo): 12/day + 3 stations.</p>
              </div>
            </div>
            <button
              onClick={() => setShowHowTo(false)}
              className="mt-6 w-full border border-[#ffb347] text-[#ffb347] py-2 text-xs hover:bg-[#ffb347]/10 tracking-widest"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-[10px] text-[#ffb347]/40">
          {isSignedIn ? `OPERATOR: ${user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'UNKNOWN'}` : 'UNAUTHORIZED — SIGN IN TO TRANSMIT'}
        </div>
        <button
          onClick={() => setShowHowTo(true)}
          className="text-[10px] text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-1 hover:bg-[#00e5ff]/10"
        >
          ? HOW IT WORKS
        </button>
      </div>

      {/* Main Radio Panel */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="border-2 border-[#00e5ff] bg-[#00e5ff]/5">
          {/* Frequency Display */}
          <div className="border-b border-[#00e5ff]/30 p-4 flex justify-between items-center">
            <span className="text-[10px] text-[#00e5ff]/60 tracking-widest">FREQUENCY</span>
            <span className="text-lg text-[#00e5ff]" style={{textShadow: '0 0 10px #00e5ff'}}>
              {selectedPreset.freq} MHz
            </span>
          </div>

          {/* Screen */}
          <div className="bg-[#1a1a2e] p-6 m-4 border border-[#ffb347]/30" style={{boxShadow: 'inset 0 0 30px rgba(255,179,71,0.05)'}}>
            <div className={`text-center text-sm tracking-widest ${isGenerating ? 'text-[#00e5ff] animate-pulse' : currentTrack ? 'text-[#00e5ff]' : 'text-[#ffb347]/50'}`}>
              ● {generationStatus}
            </div>

            {/* EQ Visualizer */}
            <div className="flex justify-center items-end h-12 gap-1 mt-4">
              {Array.from({length: 16}).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-t"
                  style={{
                    height: `${isGenerating || currentTrack ? Math.random() * 100 : 15}%`,
                    background: i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#ffb347' : '#ff2d7b',
                    transition: 'height 0.2s',
                    animation: isGenerating ? `equalize 0.3s ease-in-out infinite alternate ${i * 0.05}s` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Audio Player (visible when track is loaded) */}
            {currentTrack && (
              <audio
                controls
                src={currentTrack}
                className="w-full mt-4"
                autoPlay
                style={{filter: 'sepia(0.3) hue-rotate(180deg)'}}
              />
            )}
          </div>

          {/* Controls */}
          <div className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="text-xs">
              <span className="text-[#ffb347]/60">CREDITS:</span>{' '}
              <span className={credits > 0 ? 'text-[#00e5ff]' : 'text-[#ff2d7b]'}>
                {credits} remaining
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateTrack}
                disabled={isGenerating || credits <= 0 || !isSignedIn}
                className={`px-6 py-3 text-xs tracking-widest border-2 transition-all ${
                  isGenerating ? 'border-[#00e5ff] text-[#00e5ff] animate-pulse' :
                  credits > 0 && isSignedIn
                    ? 'border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-[#0a0a1a] hover:shadow-[0_0_20px_#00e5ff]'
                    : 'border-[#333] text-[#333] cursor-not-allowed'
                }`}
              >
                {isGenerating ? '◉ SYNTHESIZING...' : '◉ GENERATE'}
              </button>
              <a href="/api/stripe/checkout?priceId=day_pass" target="_blank">
                <button className="px-4 py-3 text-xs tracking-widest border-2 border-[#ff2d7b] text-[#ff2d7b] hover:bg-[#ff2d7b] hover:text-white transition-all">
                  GET CREDITS
                </button>
              </a>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-t border-[#00e5ff]/30 px-4 py-2 flex justify-between text-[10px] text-[#ffb347]/40">
            <span>STATION: {selectedPreset.name}</span>
            <span>BPM: {selectedPreset.bpm}</span>
            <span>GENRE: {selectedPreset.genre.toUpperCase()}</span>
          </div>
        </div>
      </section>

      {/* Preset Grid */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="text-[10px] text-[#00e5ff] tracking-[4px] mb-3">[ FREQUENCY PRESETS ]</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.freq}
              onClick={() => setSelectedPreset(preset)}
              className={`p-3 text-left border transition-all ${
                selectedPreset.freq === preset.freq
                  ? 'border-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'border-[#333] hover:border-[#ffb347]/50'
              }`}
            >
              <div className="text-[10px] text-[#00e5ff]">{preset.freq} MHz</div>
              <div className="text-xs text-[#ffb347] mt-1">{preset.name}</div>
              <div className="text-[9px] text-[#ffb347]/40 mt-1">{preset.genre} • {preset.bpm}bpm</div>
            </button>
          ))}
        </div>
      </section>

      {/* Track History */}
      {trackHistory.length > 0 && (
        <section className="max-w-3xl mx-auto mb-8">
          <div className="text-[10px] text-[#00e5ff] tracking-[4px] mb-3">[ TRANSMISSION LOG ]</div>
          <div className="space-y-2">
            {trackHistory.map((track, i) => (
              <div key={i} className="border border-[#333] p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-[#ffb347]">{track.preset}</span>
                  <span className="text-[10px] text-[#ffb347]/40 ml-3">{track.time}</span>
                </div>
                <button
                  onClick={() => {
                    setCurrentTrack(track.url);
                    if (audioRef.current) { audioRef.current.src = track.url; audioRef.current.play(); }
                  }}
                  className="text-[10px] text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-1 hover:bg-[#00e5ff]/10"
                >
                  ▶ REPLAY
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="text-[10px] text-[#00e5ff] tracking-[4px] mb-3">[ TIER SELECTION ]</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="border border-[#333] p-4 text-center">
            <div className="text-[10px] text-[#ffb347]/60 tracking-widest">FREE</div>
            <div className="text-2xl text-[#ffb347] my-2">$0</div>
            <div className="text-[10px] text-[#ffb347]/40 space-y-1">
              <p>3 tracks per day</p>
              <p>1 station</p>
              <p>Basic genres</p>
            </div>
          </div>
          <div className="border-2 border-[#00e5ff] p-4 text-center bg-[#00e5ff]/5 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00e5ff] text-[#0a0a1a] text-[8px] px-2 tracking-widest">POPULAR</div>
            <div className="text-[10px] text-[#00e5ff] tracking-widest">DAY PASS</div>
            <div className="text-2xl text-[#ffb347] my-2">$5</div>
            <div className="text-[10px] text-[#ffb347]/40 space-y-1 mb-3">
              <p>Unlimited (24h)</p>
              <p>All features</p>
              <p>Priority queue</p>
            </div>
            <a href="/api/stripe/checkout?priceId=day_pass" target="_blank">
              <button className="w-full py-2 bg-[#00e5ff] text-[#0a0a1a] text-[10px] tracking-widest hover:bg-[#00e5ff]/80">
                PURCHASE
              </button>
            </a>
          </div>
          <div className="border border-[#ff2d7b]/30 p-4 text-center">
            <div className="text-[10px] text-[#ff2d7b] tracking-widest">PRO MONTHLY</div>
            <div className="text-2xl text-[#ffb347] my-2">$7.99<span className="text-xs">/mo</span></div>
            <div className="text-[10px] text-[#ffb347]/40 space-y-1 mb-3">
              <p>12 tracks/day</p>
              <p>3 stations</p>
              <p>Social sources</p>
            </div>
            <button disabled className="w-full py-2 border border-[#ff2d7b]/30 text-[#ff2d7b]/30 text-[10px] tracking-widest cursor-not-allowed">
              COMING SOON
            </button>
          </div>
        </div>
      </section>

      {/* Tip Jar */}
      <section className="text-center max-w-md mx-auto mb-8">
        <div className="text-[10px] text-[#ffb347]/40 tracking-widest mb-3">SUPPORT THE STATION</div>
        <div className="flex gap-2 justify-center">
          {[3, 5, 10].map(amount => (
            <a key={amount} href={process.env.NEXT_PUBLIC_KOFI_URL || 'https://ko-fi.com'} target="_blank" rel="noopener">
              <button className="px-4 py-2 border border-[#ff2d7b] text-[#ff2d7b] text-xs hover:bg-[#ff2d7b]/10">
                ${amount}
              </button>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-[#333]">
        <p className="text-[10px] text-[#ffb347]/30">
          Powered by ACE-Step AI 🎵 | Built with Next.js + Clerk + Stripe
        </p>
      </footer>

      {/* CSS for EQ animation */}
      <style jsx>{`
        @keyframes equalize {
          0% { height: 10%; }
          100% { height: 100%; }
        }
      `}</style>
    </main>
  );
}
