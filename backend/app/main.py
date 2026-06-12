from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.routers import auth, ack, classes, calendar

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"\n{'='*50}")
    print("ATLAS BACKEND RUNNING")
    print(f"  Docs: {settings.backend_url}/docs")
    print(f"{'='*50}\n")
    yield

app = FastAPI(title="Atlas API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ack.router)
app.include_router(classes.router)
app.include_router(calendar.router)

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
