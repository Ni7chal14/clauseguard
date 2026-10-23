import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .db import get_db_connection



SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )


def create_access_token(user: dict) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        hours=TOKEN_EXPIRE_HOURS
    )

    payload = {
        "sub": str(user["id"]),
        "organization_id": user["organization_id"],
        "role": user["role"],
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Authentication token has expired.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
        )

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
                    role
                FROM users
                WHERE id = %s;
                """,
                (int(user_id),),
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=401,
                    detail="User account not found.",
                )

            return {
                "id": row[0],
                "organization_id": row[1],
                "name": row[2],
                "email": row[3],
                "role": row[4],
            }

    finally:
        conn.close()


def require_role(required_role: str):
    def role_checker(
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker