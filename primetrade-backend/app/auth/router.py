import logging
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from app.database import get_db
from app.models import User, RoleEnum
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.auth.utils import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user

load_dotenv()
logger = logging.getLogger(__name__)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@primetrade.ai")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@123")

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse, status_code=201,
    summary="Register a new user")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        logger.warning(f"Registration failed - email already exists: {payload.email}")
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"New user registered: {payload.email}")
    return user


@router.post("/login", response_model=TokenResponse,
    summary="Login as a normal user")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        logger.warning(f"Failed login attempt for: {payload.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    logger.info(f"User logged in: {payload.email}")
    return {"access_token": token}


@router.post("/admin/register", response_model=UserResponse, status_code=201,
    summary="[TEMP] Register admin - remove after use")
def admin_register(db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")

    admin = User(
        name="Super Admin",
        email=ADMIN_EMAIL,
        password=hash_password(ADMIN_PASSWORD),
        role=RoleEnum.admin
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    logger.info(f"Admin registered: {ADMIN_EMAIL}")
    return admin

@router.post("/admin/login", response_model=TokenResponse,
    summary="Login as admin using hardcoded credentials")
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Check against hardcoded admin credentials
    if payload.email != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        logger.warning(f"Failed admin login attempt for: {payload.email}")
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    # Fetch admin user from DB
    admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found, restart server to seed")

    token = create_access_token({"sub": str(admin.id), "role": RoleEnum.admin})
    logger.info(f"Admin logged in: {payload.email}")
    return {"access_token": token}


@router.get("/me", response_model=UserResponse,
    summary="Get current logged-in user info")
def get_me(current_user: User = Depends(get_current_user)):
    logger.info(f"User fetched their profile: {current_user.email}")
    return current_user
