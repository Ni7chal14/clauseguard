from fastapi import APIRouter, Depends, HTTPException
from ..auth import get_current_user
from ..db import get_db_connection


router = APIRouter(
    prefix="/api/organizations",
    tags=["Organizations"],
)


@router.get("/{organization_id}")
def get_organization(
    organization_id: int,
    current_user: dict = Depends(get_current_user),
):
    if current_user["organization_id"] != organization_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this organization.",
        )
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    created_at
                FROM organizations
                WHERE id = %s;
                """,
                (organization_id,),
            )

            organization = cursor.fetchone()

            if organization is None:
                raise HTTPException(
                    status_code=404,
                    detail="Organization not found.",
                )

            return {
                "id": organization[0],
                "name": organization[1],
                "created_at": organization[2],
            }

    finally:
        conn.close()

@router.get("/{organization_id}/employees")
def get_employees(
    organization_id: int,
    current_user: dict = Depends(get_current_user),
):
    if current_user["organization_id"] != organization_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this organization.",
        )

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                WHERE organization_id = %s
                ORDER BY name;
                """,
                (organization_id,),
            )

            rows = cursor.fetchall()

            return [
                {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                }
                for row in rows
            ]

    finally:
        conn.close()