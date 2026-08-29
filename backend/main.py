from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.recovery import router as recovery_router


app = FastAPI(
    title="Reclaim AI API",
    version="0.1.0",
    description="AI-powered revenue recovery infrastructure.",
)

# Development-only CORS: allow the Next.js dev frontend at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():     
    return {
        "status": "healthy",
        "service": "reclaim-ai",
        "environment": "development",
    }


app.include_router(recovery_router)