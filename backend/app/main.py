# Backend: app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Import routers
from app.routers import auth

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*60)
    print("🚀 ATLAS BACKEND STARTING")
    print("="*60)
    print(f"Backend: http://localhost:8000")
    print(f"Frontend: http://localhost:3000")
    print(f"API Docs: http://localhost:8000/docs")
    print("="*60 + "\n")
    yield
    print("\n👋 ATLAS BACKEND SHUTTING DOWN\n")

# Create FastAPI app
app = FastAPI(
    title="Atlas Authentication API",
    description="Authentication system for Atlas study planner",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    print(f"HTTP Error {exc.status_code}: {exc.detail}")
    return {
        "status": "error",
        "detail": exc.detail,
        "status_code": exc.status_code
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"\n❌ ERROR: {type(exc).__name__}")
    print(f"Message: {str(exc)}")
    print("Traceback:")
    traceback.print_exc()
    print()
    
    return {
        "status": "error",
        "detail": "Internal server error",
        "status_code": 500
    }

# Health check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "message": "Atlas Backend is running",
        "version": "1.0.0"
    }

# Include routers
app.include_router(auth.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "app": "Atlas Authentication API",
        "version": "1.0.0",
        "status": "running",
        "docs": "http://localhost:8000/docs",
        "health": "http://localhost:8000/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
