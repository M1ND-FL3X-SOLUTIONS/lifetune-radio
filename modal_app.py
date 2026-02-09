"""LifeTune Station — single CPU Modal app with animated UI + working playback."""

import modal
from modal import App

app = App("lifetune-station")

image = (
    modal.Image.debian_slim()
    .pip_install("fastapi", "uvicorn", "httpx")
)

UPSTREAM_GPU_API = "https://m1ndb0t-2045--intergalactic-music-festival-radio-api.modal.run"


@app.function(image=image)
@modal.asgi_app()
def web_ui():
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import HTMLResponse, RedirectResponse
    import httpx, os

    fast_app = FastAPI()

    @fast_app.get("/api/health")
    def health():
        return {"status": "ok", "service": "lifetune-station", "mode": "cpu-single-app"}

    @fast_app.get("/api/gpu/health")
    async def gpu_health():
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                r = await client.get(f"{UPSTREAM_GPU_API}/health")
                return {"status": "ok", "upstream_status": r.status_code, "upstream": UPSTREAM_GPU_API}
        except Exception as e:
            return {"status": "degraded", "error": str(e), "upstream": UPSTREAM_GPU_API}

    @fast_app.post("/api/generate")
    async def generate(payload: dict):
        try:
            async with httpx.AsyncClient(timeout=240.0) as client:
                r = await client.post(f"{UPSTREAM_GPU_API}/generate", json=payload)
                r.raise_for_status()
                return r.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"GPU generation failed: {e}")

    @fast_app.get("/api/stripe/checkout")
    async def checkout_get(plan: str = "day_pass"):
        payment_link = os.getenv("STRIPE_PAYMENT_LINK_URL", "").strip()
        if payment_link:
            return RedirectResponse(url=payment_link, status_code=302)
        return HTMLResponse(
            f"""<html><body style='font-family:monospace;background:#0a0a1a;color:#ffb347;padding:24px'>
            <h2 style='color:#00e5ff'>Checkout not configured yet</h2>
            <p>Plan: <b>{plan}</b></p>
            <p>Set <code>STRIPE_PAYMENT_LINK_URL</code> to enable one-click purchase.</p>
            </body></html>"""
        )

    @fast_app.post("/api/stripe/checkout")
    async def checkout_post(payload: dict | None = None):
        payment_link = os.getenv("STRIPE_PAYMENT_LINK_URL", "").strip()
        return {
            "ok": True,
            "configured": bool(payment_link),
            "url": payment_link or "https://checkout.stripe.com/test",
            "payload": payload or {},
        }

    @fast_app.get("/", response_class=HTMLResponse)
    def root():
        return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LifeTune Station</title>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box} body{margin:0;background:#0a0a1a;color:#ffb347;font-family:'Share Tech Mono',monospace}
    body:before{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28),rgba(0,0,0,.28) 1px,transparent 1px,transparent 2px);pointer-events:none}
    .wrap{max-width:980px;margin:0 auto;padding:20px}
    .card{border:2px solid #00e5ff;background:rgba(0,229,255,.06);padding:18px;margin-bottom:16px}
    .hdr{border:2px solid #ffb347;text-align:center;padding:18px;background:rgba(10,10,26,.9)}
    h1{margin:0;color:#00e5ff;text-shadow:0 0 14px #00e5ff;letter-spacing:3px}
    .sub{opacity:.7;font-size:12px;margin-top:6px}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between}
    button{border:2px solid #ffb347;background:transparent;color:#ffb347;padding:10px 14px;cursor:pointer;letter-spacing:1px}
    button:hover{background:#ffb347;color:#0a0a1a;box-shadow:0 0 16px #ffb347}
    .pri{border-color:#00e5ff;color:#00e5ff}.pri:hover{background:#00e5ff;box-shadow:0 0 16px #00e5ff}
    .eq{display:flex;gap:4px;align-items:flex-end;height:56px;margin:10px 0}
    .bar{width:8px;height:20%;background:#00e5ff;animation:eq .45s ease-in-out infinite alternate}
    .bar:nth-child(2n){background:#ffb347;animation-delay:.1s}.bar:nth-child(3n){background:#ff2d7b;animation-delay:.2s}
    @keyframes eq{0%{height:10%}100%{height:100%}}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
    .p{border:1px solid #333;padding:10px}.p.active{border-color:#00e5ff;background:rgba(0,229,255,.08)}
    .tiny{font-size:12px;opacity:.7}
    audio{width:100%;margin-top:10px}
    .ok{color:#00e5ff}.err{color:#ff2d7b}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>⚡ LIFETUNE STATION</h1>
      <div class="sub">retro-modern AI radio • single CPU app • autonomous-ready</div>
    </div>

    <div class="card">
      <div class="row">
        <div id="status">● STANDBY</div>
        <div class="tiny">Credits: <span id="credits">3</span></div>
      </div>
      <div class="eq" id="eq">
        <div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div>
        <div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div>
        <div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div><div class='bar'></div>
      </div>
      <div class="row">
        <button class="pri" id="genBtn">GENERATE TRACK</button>
        <a href="/api/stripe/checkout" target="_blank"><button>GET CREDITS</button></a>
      </div>
      <audio id="player" controls></audio>
    </div>

    <div class="card">
      <div class="tiny" style="margin-bottom:8px">PRESETS</div>
      <div class="grid" id="presets"></div>
    </div>

    <div class="card tiny">
      <div>Health: <a class="ok" href="/api/health" target="_blank">/api/health</a> · GPU: <a class="ok" href="/api/gpu/health" target="_blank">/api/gpu/health</a></div>
      <div>API: <span id="apiState">checking...</span></div>
    </div>
  </div>

  <script>
    const presets = [
      {name:'TRIBAL RESONANCE', prompt:'tribal electronic ambient bass-heavy world-music', bpm:95},
      {name:'NEURAL DRIFT', prompt:'deep ambient neural atmospheric ethereal', bpm:70},
      {name:'CYBER PULSE', prompt:'cyberpunk synthwave dark electronic driving', bpm:128},
      {name:'MEDITATION', prompt:'meditation calm peaceful healing spiritual church', bpm:60},
      {name:'VOID LOUNGE', prompt:'lo-fi chill jazz atmospheric smooth night', bpm:80},
      {name:'STELLAR GROOVE', prompt:'house disco funk electronic upbeat groove', bpm:122}
    ];
    let selected = presets[0];
    let credits = Number(localStorage.getItem('lifetune_credits')||'3');
    const creditsEl = document.getElementById('credits');
    const statusEl = document.getElementById('status');
    const player = document.getElementById('player');
    const presetsEl = document.getElementById('presets');
    creditsEl.textContent = credits;

    function renderPresets(){
      presetsEl.innerHTML = '';
      presets.forEach((p,i)=>{
        const d=document.createElement('div');
        d.className='p'+(p===selected?' active':'');
        d.innerHTML=`<div>${p.name}</div><div class='tiny'>${p.bpm} bpm</div>`;
        d.onclick=()=>{selected=p;renderPresets();};
        presetsEl.appendChild(d);
      });
    }
    renderPresets();

    async function b64ToBlobUrl(b64,mime='audio/wav'){ const bin=atob(b64); const arr=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i); return URL.createObjectURL(new Blob([arr],{type:mime})); }

    document.getElementById('genBtn').onclick = async ()=>{
      if(credits<=0){ statusEl.innerHTML='<span class="err">No credits left</span>'; return; }
      statusEl.innerHTML='<span class="ok">Synthesizing...</span>';
      try{
        const r = await fetch('/api/generate', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt:selected.prompt,duration:60,bpm:selected.bpm})});
        const data = await r.json();
        if(!r.ok) throw new Error(data.detail||'generate failed');
        let src = data.audio_url || null;
        if(!src && data.audio_base64) src = await b64ToBlobUrl(data.audio_base64);
        if(!src) throw new Error('No audio returned');
        player.src = src;
        await player.play();
        credits -= 1; localStorage.setItem('lifetune_credits', String(credits)); creditsEl.textContent=credits;
        statusEl.innerHTML = `<span class='ok'>Now playing: ${selected.name}</span>`;
      }catch(e){ statusEl.innerHTML = `<span class='err'>${e.message}</span>`; }
    };

    fetch('/api/gpu/health').then(r=>r.json()).then(()=>{
      document.getElementById('apiState').innerHTML = '<span class="ok">connected</span>'
    }).catch(()=>{
      document.getElementById('apiState').innerHTML = '<span class="err">offline</span>'
    });
  </script>
</body>
</html>
        """

    return fast_app


if __name__ == "__main__":
    print("Deploy: modal deploy modal_app.py")
