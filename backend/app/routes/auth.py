from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..auth import create_access_token, hash_password, verify_password
from ..db import get_db_connection


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "EMPLOYEE"
    title: str | None = None
    department: str | None = None


class LoginRequest(BaseModel):
    identity: str
    password: str


@router.post("/register")
def register(request: RegisterRequest):
    role = request.role.upper()

    if role not in {"HR", "EMPLOYEE"}:
        raise HTTPException(
            status_code=400,
            detail="Role must be HR or EMPLOYEE.",
        )

    if len(request.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters.",
        )

    password_hash = hash_password(request.password)

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM organizations
                ORDER BY id
                LIMIT 1;
                """
            )

            organization = cursor.fetchone()

            if organization is None:
                raise HTTPException(
                    status_code=400,
                    detail="No organization exists.",
                )

            organization_id = organization[0]

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE organization_id = %s
                AND email = %s;
                """,
                (organization_id, request.email),
            )

            if cursor.fetchone() is not None:
                raise HTTPException(
                    status_code=409,
                    detail="An account with this email already exists.",
                )

            cursor.execute(
                """
                INSERT INTO users (
                    organization_id,
                    name,
                    email,
                    password_hash,
                    role
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, organization_id, name, email, role;
                """,
                (
                    organization_id,
                    request.username,
                    request.email,
                    password_hash,
                    role,
                ),
            )

            row = cursor.fetchone()

        conn.commit()

        user = {
            "id": row[0],
            "organization_id": row[1],
            "name": row[2],
            "email": row[3],
            "role": row[4],
        }

        token = create_access_token(user)

        return {
            "token": token,
            "user": user,
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


@router.post("/login")
def login(request: LoginRequest):
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    organization_id,
                    name,
                    email,
                    password_hash,
                    role
                FROM users
                WHERE email = %s
                   OR name = %s
                LIMIT 1;
                """,
                (
                    request.identity,
                    request.identity,
                ),
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid username/email or password.",
                )

            password_hash = row[4]

            if not verify_password(request.password, password_hash):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid username/email or password.",
                )

            user = {
                "id": row[0],
                "organization_id": row[1],
                "name": row[2],
                "email": row[3],
                "role": row[5],
            }

            token = create_access_token(user)

            return {
                "token": token,
                "user": user,
            }

    finally:
        conn.close()