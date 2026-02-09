"""LifeTune Radio — Modal API wrapper"""

import modal
from modal import App

app = App("lifetune-station")

image = (
    modal.Image.debian_slim()
    .pip_install("fastapi", "uvicorn")
)

@app.function(image=image)
@modal.asgi_app()
def web_ui():
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    
    fast_app = FastAPI()
    
    @fast_app.get("/api/health")
    def health():
        return {"status": "ok", "service": "lifetune-radio"}
    
    @fast_app.post("/api/stripe/checkout")
    def checkout_test():
        return {"test": True, "url": "https://checkout.stripe.com/test"}
    
    @fast_app.get("/", response_class=HTMLResponse)
    def root():
        return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LifeTune Radio — Incoming Transmission</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a1a;
            color: #ffb347;
            font-family: 'Share Tech Mono', monospace;
            min-height: 100vh;
            overflow-x: hidden;
        }
        body::before {
            content: "";
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35) 1px, transparent 1px, transparent 2px);
            pointer-events: none; z-index: 1000;
        }
        .container {
            max-width: 900px; margin: 0 auto; padding: 20px;
            position: relative; z-index: 10;
        }
        .header {
            text-align: center; padding: 30px 20px;
            border: 2px solid #ffb347; margin-bottom: 30px;
            background: rgba(10, 10, 26, 0.9);
        }
        h1 {
            font-size: 32px; color: #00e5ff;
            text-shadow: 0 0 20px #00e5ff;
            margin-bottom: 10px; letter-spacing: 4px;
        }
        .subtitle { color: #ffb347; font-size: 12px; opacity: 0.7; }
        .radio-panel {
            border: 3px solid #00e5ff; padding: 30px;
            margin-bottom: 30px;
            background: rgba(0, 229, 255, 0.05);
        }
        .display {
            background: #1a1a2e; border: 2px solid #ffb347;
            padding: 40px; margin-bottom: 20px;
            text-align: center;
            box-shadow: inset 0 0 30px rgba(255, 179, 71, 0.1);
        }
        .visualizer {
            display: flex; justify-content: center; align-items: flex-end;
            height: 60px; gap: 3px; margin: 20px 0;
        }
        .bar {
            width: 8px; background: #00e5ff;
            animation: equalize 0.5s ease-in-out infinite alternate;
        }
        @keyframes equalize { 0% { height: 10%; } 100% { height: 100%; } }
        button {
            background: transparent; border: 2px solid #ffb347;
            color: #ffb347; padding: 15px 30px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px; cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase; letter-spacing: 2px;
        }
        button:hover { background: #ffb347; color: #0a0a1a; box-shadow: 0 0 20px #ffb347; }
        button.primary { border-color: #00e5ff; color: #00e5ff; }
        button.primary:hover { background: #00e5ff; box-shadow: 0 0 20px #00e5ff; }
        .status-bar {
            display: flex; justify-content: space-between;
            padding: 15px 20px; background: #1a1a2e;
            border: 1px solid #00e5ff; margin-top: 20px;
            font-size: 11px;
        }
        .status-item { display: flex; align-items: center; gap: 8px; }
        .indicator {
            width: 8px; height: 8px; background: #333;
            border-radius: 50%;
        }
        .indicator.active {
            background: #00e5ff; box-shadow: 0 0 10px #00e5ff;
            animation: blink 1s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px; margin-top: 15px;
        }
        .pricing-card {
            border: 2px solid #333;
            padding: 20px; text-align: center;
        }
        .pricing-card.popular {
            border-color: #00e5ff;
            background: rgba(0, 229, 255, 0.05);
        }
        .price { font-size: 28px; color: #ffb347; margin: 10px 0; }
        .footer {
            text-align: center; padding: 30px;
            border-top: 1px solid #333;
            margin-top: 40px; font-size: 10px; color: #666;
        }
        .footer a { color: #00e5ff; text-decoration: none; }
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
                <div style="color:#ffb347;font-size:18px;letter-spacing:2px;">● STANDBY — READY TO TRANSMIT</div>
                <div class="visualizer">
                    <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                    <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                    <div class="bar"></div><div class="bar"></div>
                </div>
            </div>
            <div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;">
                <button class="primary">GENERATE MIX</button>
                <button>GET CREDITS</button>
            </div>
            <div class="status-bar">
                <div class="status-item"><div class="indicator active"></div><span>SIGNAL: STRONG</span></div>
                <div><span>CREDITS: 1</span></div>
                <div><span>API: CONNECTED</span></div>
            </div>
        </div>
        <div style="border:1px solid #ffb347;padding:25px;margin-bottom:20px;">
            <div style="color:#00e5ff;font-size:12px;margin-bottom:15px;letter-spacing:3px;">[ TIER SELECTION ]</div>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <div style="font-size:12px;color:#666">FREE</div>
                    <div class="price">$0</div>
                    <div style="font-size:11px;color:#ffb347;opacity:0.7">
                        1 track/day • 1 station
                    </div>
                </div>
                <div class="pricing-card popular">
                    <div style="font-size:12px;color:#00e5ff">DAY PASS</div>
                    <div class="price">$5</div>
                    <a href="/api/stripe/checkout" target="_blank">
                        <button class="primary" style="width:100%;margin-top:10px;">PURCHASE</button>
                    </a>
                </div>
                <div class="pricing-card">
                    <div style="font-size:12px;color:#ff2d7b">PRO MONTHLY</div>
                    <div class="price">$7.99</div>
                    <div style="font-size:11px;color:#ffb347;opacity:0.7">
                        12 tracks/day • 3 stations
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer">
            <p><a href="/api/health">[ SYSTEM STATUS ]</a> // <a href="/api/stripe/checkout">[ CHECKOUT ]</a></p>
            <p>Built with Next.js + Clerk + Stripe + Supabase</p>
        </footer>
    </div>
</body>
</html>'''
    
    return fast_app

if __name__ == "__main__":
    print("Deploy: modal deploy modal_app.py")
