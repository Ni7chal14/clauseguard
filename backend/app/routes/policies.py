from pathlib import Path
from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from ..db import get_db_connection
from ai.app.loaders import load_document
from ai.app.chunker import chunk_text
from ai.app.embeddings import embed_texts
from ai.app.vector_store import create_collection, add_chunks
from ai.app.policy_extractor import extract_policy_rules
from ai.app.policy_repository import save_policy_rules
from ..auth import require_role

router = APIRouter(
    prefix="/api/organizations/{organization_id}/policies",
    tags=["Policies"],
)


@router.get("")
def get_organization_policies(
    organization_id: int,
):
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # First verify that the organization exists.
            cursor.execute(
                """
                SELECT id
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

            # Get all policies belonging to the organization.
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    document_type,
                    version,
                    file_url,
                    uploaded_by,
                    is_active,
                    created_at
                FROM policies
                WHERE organization_id = %s
                ORDER BY created_at DESC;
                """,
                (organization_id,),
            )

            policies = cursor.fetchall()

            return {
                "organization_id": organization_id,
                "policies": [
                    {
                        "id": policy[0],
                        "name": policy[1],
                        "document_type": policy[2],
                        "version": policy[3],
                        "file_url": policy[4],
                        "uploaded_by": policy[5],
                        "is_active": policy[6],
                        "created_at": policy[7],
                    }
                    for policy in policies
                ],
            }

    finally:
        conn.close()

@router.post("")
async def upload_policy(
    organization_id: int,
    uploaded_by: int,
    name: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(require_role("HR")),
):
    allowed_types = {
        "application/pdf",
        "text/plain",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT policy files are allowed.",
        )

    # ---------------------------------------------------------
    # 1. Verify organization exists
    # ---------------------------------------------------------

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM organizations
                WHERE id = %s;
                """,
                (organization_id,),
            )

            if cursor.fetchone() is None:
                raise HTTPException(
                    status_code=404,
                    detail="Organization not found.",
                )

    finally:
        conn.close()

    # ---------------------------------------------------------
    # 2. Save physical policy file
    # ---------------------------------------------------------

    upload_dir = Path("backend/uploads/policies")
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = Path(file.filename).name
    file_path = upload_dir / safe_filename

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Policy file must be 10 MB or smaller.",
        )

    file_path.write_bytes(contents)

    # ---------------------------------------------------------
    # 3. Create policy record in PostgreSQL
    # ---------------------------------------------------------

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            # Find the latest version of this policy.
            cursor.execute(
                """
                SELECT version
                FROM policies
                WHERE organization_id = %s
                AND name = %s
                ORDER BY created_at DESC
                LIMIT 1;
                """,
                (
                    organization_id,
                    name,
                ),
            )

            latest_policy = cursor.fetchone()

            if latest_policy is None:
                version = "1.0"
            else:
                latest_version = latest_policy[0]

                try:
                    version_number = float(latest_version)
                    version = f"{version_number + 1:.1f}"
                except (ValueError, TypeError):
                    version = "1.0"

            # Mark all previously active policies for this organization
            # as inactive before activating the newly uploaded policy.
            cursor.execute(
                """
                UPDATE policies
                SET is_active = FALSE
                WHERE organization_id = %s
                AND name = %s
                AND is_active = TRUE;
                """,
                (
                    organization_id,
                    name,
                ),
            )

            cursor.execute(
                """
                INSERT INTO policies (
                    organization_id,
                    name,
                    document_type,
                    version,
                    file_url,
                    uploaded_by,
                    is_active,
                    created_at
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    NOW()
                )
                RETURNING id;
                """,
                (
                    organization_id,
                    name,
                    file.content_type,
                    version,
                    str(file_path),
                    uploaded_by,
                    True,
                ),
            )

            policy_id = cursor.fetchone()[0]

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

    # ---------------------------------------------------------
    # 4. Ingest policy into RAG / Qdrant
    # ---------------------------------------------------------

    try:
        # Extract text
        text = load_document(str(file_path))

        if not text.strip():
            raise ValueError(
                "The uploaded policy contains no readable text."
            )
        
        # Extract structured policy rules
        policy_rules = extract_policy_rules(
            policy_text=text,
            policy_name=name,
            policy_version=version,
        )

        # Save extracted policy rules
        save_policy_rules(policy_id, policy_rules)

        # Split into chunks
        chunks = chunk_text(text)

        if not chunks:
            raise ValueError(
                "No chunks could be created from the policy."
            )

        # Generate embeddings
        embeddings = embed_texts(chunks)

        # Ensure Qdrant collection exists
        create_collection()

        # Store chunks and embeddings
        add_chunks(
            chunks=chunks,
            embeddings=embeddings,
            source=file.filename,
            policy_id=policy_id,
        )

    except Exception as ingestion_error:
        print(
            f"WARNING: Policy {policy_id} was saved, "
            f"but RAG ingestion failed: {ingestion_error}"
        )

        return {
            "policy_id": policy_id,
            "name": name,
            "version": version,
            "file_url": str(file_path),
            "message": "Policy uploaded, but RAG indexing failed.",
            "ingestion_error": str(ingestion_error),
        }

    # ---------------------------------------------------------
    # 5. Successful response
    # ---------------------------------------------------------

    return {
        "policy_id": policy_id,
        "name": name,
        "version": version,
        "file_url": str(file_path),
        "message": "Policy uploaded and indexed successfully.",
        "chunks_indexed": len(chunks),
    }

@router.patch("/{policy_id}/archive")
def archive_policy(
    organization_id: int,
    policy_id: int,
    current_user: dict = Depends(require_role("HR")),
):
    """
    Archive a policy so it is no longer used by the RAG system.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT id
                FROM policies
                WHERE id = %s
                AND organization_id = %s;
                """,
                (
                    policy_id,
                    organization_id,
                ),
            )

            policy = cursor.fetchone()

            if policy is None:
                raise HTTPException(
                    status_code=404,
                    detail="Policy not found.",
                )

            cursor.execute(
                """
                UPDATE policies
                SET is_active = FALSE
                WHERE id = %s
                AND organization_id = %s;
                """,
                (
                    policy_id,
                    organization_id,
                ),
            )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

    return {
        "policy_id": policy_id,
        "message": "Policy archived successfully.",
    }

@router.patch("/{policy_id}/activate")
def activate_policy(
    organization_id: int,
    policy_id: int,
    current_user: dict = Depends(require_role("HR")),
):
    """
    Activate a policy and archive any other active policy
    with the same name.
    """
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # Get the policy and verify it belongs to this organization.
            cursor.execute(
                """
                SELECT id, name
                FROM policies
                WHERE id = %s
                AND organization_id = %s;
                """,
                (
                    policy_id,
                    organization_id,
                ),
            )

            policy = cursor.fetchone()

            if policy is None:
                raise HTTPException(
                    status_code=404,
                    detail="Policy not found.",
                )

            policy_name = policy[1]

            # Archive any currently active policy
            # with the same name.
            cursor.execute(
                """
                UPDATE policies
                SET is_active = FALSE
                WHERE organization_id = %s
                AND name = %s
                AND id != %s
                AND is_active = TRUE;
                """,
                (
                    organization_id,
                    policy_name,
                    policy_id,
                ),
            )

            # Activate the selected policy.
            cursor.execute(
                """
                UPDATE policies
                SET is_active = TRUE
                WHERE id = %s
                AND organization_id = %s;
                """,
                (
                    policy_id,
                    organization_id,
                ),
            )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

    return {
        "policy_id": policy_id,
        "message": "Policy activated successfully.",
    }