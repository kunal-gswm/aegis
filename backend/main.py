from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.database import init_db
from app.core.websocket import manager
from dotenv import load_dotenv
import uvicorn
import logging

load_dotenv()

# Initialize Database
init_db()

app = FastAPI(
    title="AegisAI Enterprise Platform",
    description="Enterprise-Grade AI Security Operations Center (ASOP)",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api/v1")

@app.websocket("/ws/terminal")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Handle incoming client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"status": "online", "version": "2.0.0-enterprise"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
