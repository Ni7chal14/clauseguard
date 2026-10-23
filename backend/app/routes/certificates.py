from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from ..db import get_db_connection

from ..services.review_service import (
    get_submission,
    update_submission_file_url,
)

from .reviews import rereview_submission

router = APIRouter(
    prefix="/api/certificates",
    tags=["Certificates"],
)


UPLOAD_DIR = Path("backend/uploads/certificates")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/{submission_id}")
async def upload_certificate(
    submission_id: int,
    file: UploadFile = File(...),
):
    # Allow common certificate formats.
    allowed_types = {
        "application/pdf",
        "image/jpeg",
        "image/png",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG, and PNG files are allowed.",
        )

    file_path = UPLOAD_DIR / f"submission_{submission_id}_{file.filename}"

    contents = await file.read()

    # 5 MB limit.
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Certificate file must be 5 MB or smaller.",
        )

    file_path.write_bytes(contents)

    update_submission_file_url(
        submission_id=submission_id,
        file_url=str(file_path),
    )

    review_result = rereview_submission(submission_id)

    return {
        "submission_id": submission_id,
        "filename": file.filename,
        "file_url": str(file_path),
        "message": "Certificate uploaded and submission re-reviewed successfully.",
        "review": review_result,
    }