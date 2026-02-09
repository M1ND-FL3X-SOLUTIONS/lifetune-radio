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
        return """
        <h1 style="color:#00e5ff">LifeTune Radio 🎵</h1>
        <p>Modal test endpoint active</p>
        <ul>
            <li><a href="/api/health">/api/health</a></li>
            <li><a href="/api/stripe/checkout">/api/stripe/checkout</a></li>
        </ul>
        """
    
    return fast_app

if __name__ == "__main__":
    print("Deploy: modal deploy modal_app.py")
