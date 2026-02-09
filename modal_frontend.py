"""LifeTune Radio — Full Intergalactic Frontend on Modal"""

import modal
from modal import App

app = App("lifetune-station-frontend")

image = (
    modal.Image.debian_slim()
    .pip_install("fastapi", "uvicorn")
)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LifeTune Radio — Incoming Transmission</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #0a0a1a;
            color: #ffb347;
            font-family: 'Share Tech Mono', monospace;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        /* CRT Scanlines */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.35),
                rgba(0, 0, 0, 0.35) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 1000;
            animation: scanlines 0.1s infinite;
        }
        
        @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(2px); }
        }
        
        /* Screen flicker */
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 0.98; }
            94% { opacity: 0.95; }
            96% { opacity: 0.99; }
        }
        
        .container {
            animation: flicker 5s infinite;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 10;
        }
        
        /* Header */
        .header {
            text-align: center;
            padding: 30px 20px;
            border: 2px solid #ffb347;
            margin-bottom: 30px;
            position: relative;
            background: rgba(10, 10, 26, 0.9);
        }
        
        .header::before {
            content: "⚠️ INCOMING SIGNAL";
            position: absolute;
            top: -12px;
            left: 20px;
            background: #0a0a1a;
            padding: 0 10px;
            color: #ff2d7b;
            font-size: 10px;
            letter-spacing: 2px;
        }
        
        h1 {
            font-size: 32px;
            color: #00e5ff;
            text-shadow: 0 0 20px #00e5ff;
            margin-bottom: 10px;
            letter-spacing: 4px;
        }
        
        .subtitle {
            color: #ffb347;
            font-size: 12px;
            opacity: 0.7;
        }
        
        /* Radio Panel */
        .radio-panel {
            border: 3px solid #00e5ff;
            padding: 30px;
            margin-bottom: 30px;
            background: rgba(0, 229, 255, 0.05);
            position: relative;
        }
        
        .radio-panel::after {
            content: "FREQ: 108.3 MHz";
            position: absolute;
            top: 10px;
            right: 20px;
            color: #00e5ff;
            font-size: 11px;
            opacity: 0.6;
        }
        
        /* Display Screen */
        .display {
            background: #1a1a2e;
            border: 2px solid #ffb347;
            padding: 40px;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
            box-shadow: inset 0 0 30px rgba(255, 179, 71, 0.1);
        }
        
        .display-text {
            color: #ffb347;
            font-size: 18px;
            letter-spacing: 2px;
        }
        
        .display-text.playing {
            color: #00e5ff;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        
        /* Visualizer */
        .visualizer {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 60px;
            gap: 3px;
            margin: 20px 0;
        }
        
        .bar {
            width: 8px;
            background: #00e5ff;
            animation: equalize 0.5s ease-in-out infinite alternate;
        }
        
        .bar:nth-child(2) { animation-delay: 0.1s; background: #ffb347; }
        .bar:nth-child(3) { animation-delay: 0.2s; }
        .bar:nth-child(4) { animation-delay: 0.3s; background: #ff2d7b; }
        .bar:nth-child(5) { animation-delay: 0.4s; }
        .bar:nth-child(6) { animation-delay: 0.15s; background: #ffb347; }
        .bar:nth-child(7) { animation-delay: 0.25s; }
        .bar:nth-child(8) { animation-delay: 0.35s; background: #00e5ff; }
        
        @keyframes equalize {
            0% { height: 10%; }
            100% { height: 100%; }
        }
        
        /* Controls */
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        button {
            background: transparent;
            border: 2px solid #ffb347;
            color: #ffb347;
            padding: 15px 30px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
        }
        
        button:hover:not(:disabled) {
            background: #ffb347;
            color: #0a0a1a;
            box-shadow: 0 0 20px #ffb347;
        }
        
        button:disabled {
            border-color: #444;
            color: #444;
            cursor: not-allowed;
        }
        
        button.primary {
            border-color: #00e5ff;
            color: #00e5ff;
        }
        
        button.primary:hover:not(:disabled) {
            background: #00e5ff;
            box-shadow: 0 0 20px #00e5ff;
        }
        
        button.danger {
            border-color: #ff2d7b;
            color: #ff2d7b;
        }
        
        /* Status Bar */
        .status-bar {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: #1a1a2e;
            border: 1px solid #00e5ff;
            margin-top: 20px;
            font-size: 11px;
        }
        
        .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .indicator {
            width: 8px;
            height: 8px;
            background: #333;
            border-radius: 50%;
        }
        
        .indicator.active {
            background: #00e5ff;
            box-shadow: 0 0 10px #00e5ff;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        
        /* Sections */
        .section {
            border: 1px solid #ffb347;
            padding: 25px;
            margin-bottom: 20px;
            background: rgba(255, 179, 71, 0.02);
        }
        
        .section-title {
            color: #00e5ff;
            font-size: 12px;
            margin-bottom: 15px;
            letter-spacing: 3px;
            border-bottom: 1px solid #00e5ff;
            padding-bottom: 5px;
        }
        
        /* Pricing Cards */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .pricing-card {
            border: 2px solid #333;
            padding: 20px;
            text-align: center;
            position: relative;
        }
        
        .pricing-card.popular {
            border-color: #00e5ff;
            background: rgba(0, 229, 255, 0.05);
        }
        
        .pricing-card.popular::before {
            content: "POPULAR";
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #00e5ff;
            color: #0a0a1a;
            padding: 2px 10px;
            font-size: 9px;
            letter-spacing: 2px;
        }
        
        .price {
            font-size: 28px;
            color: #ffb347;
            margin: 10px 0;
        }
        
        .price span {
            font-size: 12px;
            opacity: 0.6;
        }
        
        .features {
            list-style: none;
            font-size: 11px;
            color: #ffb347;
            opacity: 0.7;
        }
        
        .features li {
            padding: 5px 0;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 30px;
            border-top: 1px solid #333;
            margin-top: 40px;
            font-size: 10px;
            color: #666;
        }
        
        .footer a {
            color: #00e5ff;
            text-decoration: none;
        }
        
        /* Animations */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .container > * {
            animation: slideIn 0.5s ease-out;
        }
        
        /* Glitch effect on hover */
        .glitch:hover {
            animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, 0); }
            80% { transform: translate(2px, 0); }
            100% { transform: translate(0); }
        }
        
        /* Mobile */
        @media (max-width: 600px) {
            h1 { font-size: 20px; }
            .radio-panel { padding: 15px; }
            button { padding: 12px 20px; font-size: 12px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>⚡ LIFETUNE RADIO</h1>
            <p class="subtitle">AI MUSIC // PERSONALIZED TRANSMISSIONS // DAILY DELIVERY</p>
        </header>
        
        <div class="radio-panel">
            <div class="display">
                <div class="display-text" id="status-text">● STANDBY — READY TO TRANSMIT</div>
                <div class="visualizer" id="visualizer">
                    <div class="bar" style="height: 20%"></div>
                    <div class="bar" style="height: 40%"></div>
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 50%"></div>
                    <div class="bar" style="height: 70%"></div>
                    <div class="bar" style="height: 30%"></div>
                    <div class="bar" style="height: 90%"></div>
                </div>
            </div>
            
            <div class="controls">
                <button class="primary glitch" onclick="generateTrack()">
                    GENERATE DAILY MIX
                </button>
                <button onclick="showPricing()">
                    GET MORE CREDITS
                </button>
            </div>
            
            <div class="status-bar">
                <div class="status-item">
                    <div class="indicator active" id="signal-indicator"></div>
                    <span>SIGNAL: STRONG</span>
                </div>
                <div class="status-item">
                    <span id="credits-display">CREDITS: 1</span>
                </div>
                <div class="status-item">
                    <span id="api-status">API: CONNECTED</span>
                </div>
            </div>
        </div>
        
        <div class="section" id="pricing-section">
            <div class="section-title">[ TIER SELECTION ]</div>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <div style="font-size: 12px; letter-spacing: 2px; color: #666; margin-bottom: 10px;">FREE</div>
                    <div class="price">$0</div>
                    <ul class="features">
                        <li>1 track per day</li>
                        <li>1 station slot</li>
                        <li>Basic genres</li>
                    </ul>
                    <button disabled style="margin-top: 15px; width: 100%;">ACTIVE</button>
                </div>
                
                <div class="pricing-card popular">
                    <div style="font-size: 12px; letter-spacing: 2px; color: #00e5ff; margin-bottom: 10px;">DAY PASS</div>
                    <div class="price">$5</div>
                    <ul class="features">
                        <li>Unlimited tracks (24h)</li>
                        <li>All features unlocked</li>
                        <li>Priority queue</li>
                    </ul>
                    <button class="primary" onclick="buyDayPass()" style="margin-top: 15px; width: 100%;">
                        PURCHASE
                    </button>
                </div>
                
                <div class="pricing-card">
                    <div style="font-size: 12px; letter-spacing: 2px; color: #ff2d7b; margin-bottom: 10px;">PRO MONTHLY</div>
                    <div class="price">$7.99<span>/mo</span></div>
                    <ul class="features">
                        <li>12 tracks per day</li>
                        <li>3 stations</li>
                        <li>Social ingestion</li>
                    </ul>
                    <button disabled style="margin-top: 15px; width: 100%;">COMING SOON</button>
                </div>
            </div>
        </div>
        
        <footer class="footer">
            <p><a href="/api/health">[ SYSTEM STATUS ]</a> // <a href="/api/stripe/checkout">[ CHECKOUT TEST ]</a></p>
            <p style="margin-top: 10px;">Built with Next.js + Clerk + Stripe + Supabase</p>
            <p>© 2026 LifeTune Radio</p>
        </footer>
    </div>
    
    <script>
        let credits = 1;
        let isGenerating = false;
        
        async function generateTrack() {
            if (isGenerating || credits <= 0) {
                if (credits <= 0) {
                    document.getElementById('status-text').textContent = ">>> INSUFFICIENT CREDITS";
                }
                return;
            }
            
            isGenerating = true;
            document.getElementById('status-text').textContent = ">>> SYNTHESIZING TRANSMISSION...";
            document.getElementById('status-text').classList.add('playing');
            
            // Animate visualizer faster
            document.querySelectorAll('.bar').forEach(bar => {
                bar.style.animationDuration = '0.2s';
            });
            
            // Simulate generation (would call ACE-Step API here)
            await new Promise(r => setTimeout(r, 2000));
            
            credits--;
            document.getElementById('credits-display').textContent = `CREDITS: ${credits}`;
            document.getElementById('status-text').textContent = ">>> TRANSMISSION RECEIVED ✓";
            
            // Add a fake audio element
            setTimeout(() => {
                document.getElementById('status-text').textContent = ">>> NOW PLAYING: DAILY MIX #001";
            }, 500);
            
            isGenerating = false;
        }
        
        function buyDayPass() {
            window.open('/api/stripe/checkout', '_blank');
        }
        
        function showPricing() {
            document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Check API health on load
        fetch('/api/health')
            .then(r => r.json())
            .then(data => {
                document.getElementById('api-status').textContent = 
                    data.status === 'ok' ? 'API: CONNECTED' : 'API: DEGRADED';
            })
            .catch(() => {
                document.getElementById('api-status').textContent = 'API: OFFLINE';
            });
    </script>
</body>
</html>
"""

@app.function(image=image)
@modal.asgi_app()
def web_ui():
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    import json
    
    fast_app = FastAPI()
    
    @fast_app.get("/api/health")
    def health():
        return {"status": "ok", "service": "lifetune-station", "version": "0.2.0"}
    
    @fast_app.post("/api/stripe/checkout")
    def checkout_test():
        return {
            "test": True,
            "url": "https://checkout.stripe.com/test",
            "mode": "day_pass",
            "amount": 500
        }
    
    @fast_app.get("/", response_class=HTMLResponse)
    def root():
        return HTML_TEMPLATE
    
    return fast_app

if __name__ == "__main__":
    print("Deploy: modal deploy modal_frontend.py")
