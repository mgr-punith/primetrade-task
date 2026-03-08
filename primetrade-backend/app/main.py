from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.logger import setup_logging

setup_logging()  # must be first

import logging
logger = logging.getLogger(__name__)

from app.database import Base, engine
from app.auth.router import router as auth_router
from app.tasks.router import router as tasks_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PrimeTrade API",
    description="Scalable REST API with JWT Auth & Role-Based Access",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://primetrade-task-rho.vercel.app"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)

@app.get("/")
def root():
    logger.info("Root endpoint hit")
    return {"message": "PrimeTrade API is running"}
