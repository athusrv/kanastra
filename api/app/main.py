from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import document, events
from .core.db import AsyncDBSession

app = FastAPI()
app.include_router(document.router)
app.include_router(events.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production this should contain only whitelisted domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def before_after_request(request: Request, next):
    response = Response("Internal server error", status_code=500)
    try:
        AsyncDBSession()
        response = await next(request)
    finally:
        await AsyncDBSession.remove()

    return response
