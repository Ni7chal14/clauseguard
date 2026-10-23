from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.chat import router as chat_router
from backend.app.routes.certificates import router as certificates_router

from .app.routes.organizations import (
    router as organizations_router,
)

from .app.routes.policies import (
    router as policies_router,
)

from .app.routes.policy_rules import (
    router as policy_rules_router,
)

from .app.routes.reviews import (
    router as reviews_router,
)

from .app.routes.health import router as health_router
from .app.routes.auth import router as auth_router


app = FastAPI(
    title="ClauseGuard API",
    version="1.0.0",
)


app.mount(
    "/uploads",
    StaticFiles(directory="backend/uploads"),
    name="uploads",
)

app.mount(
    "/test-data",
    StaticFiles(directory="ai/test_data"),
    name="test-data",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ClauseGuard API",
    }


app.include_router(auth_router)
app.include_router(organizations_router)
app.include_router(policies_router)
app.include_router(policy_rules_router)
app.include_router(reviews_router)
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(certificates_router)