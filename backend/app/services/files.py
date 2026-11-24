"""Saving and reading uploaded files (registration documents).

Files are stored under UPLOAD_DIR with a random name, never the name the user gave. Only PDF, JPG and
PNG are accepted, and the type is checked from the file's first bytes, not only from its name.
"""
import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.base import utcnow
from app.models import StoredFile
from app.services.errors import ServiceError

# first bytes of each accepted type -> (content type, extension)
_SIGNATURES = [
    (b'%PDF-', 'application/pdf', '.pdf'),
    (b'\x89PNG\r\n\x1a\n', 'image/png', '.png'),
    (b'\xff\xd8\xff', 'image/jpeg', '.jpg'),
]


def upload_root() -> Path:
    return Path(get_settings().upload_dir).resolve()


def _detect(head: bytes) -> tuple[str, str] | None:
    for magic, content_type, ext in _SIGNATURES:
        if head.startswith(magic):
            return content_type, ext
    return None


def _clean_name(name: str | None) -> str:
    base = Path(name or 'document').name.strip() or 'document'
    return base[:200]


def save_file(db: Session, data: bytes, original_name: str | None, uploaded_by: str, folder: str) -> StoredFile:
    """Check and store one file. `folder` groups files on disk (e.g. 'registration')."""
    limit = get_settings().max_upload_mb * 1024 * 1024
    if not data:
        raise ServiceError('The file is empty.')
    if len(data) > limit:
        raise ServiceError(f'The file is larger than {get_settings().max_upload_mb} MB.')
    kind = _detect(data[:16])
    if not kind:
        raise ServiceError('Upload a PDF, JPG or PNG file.')
    content_type, ext = kind

    file_id = str(uuid.uuid4())
    relative = Path(folder) / utcnow().strftime('%Y/%m') / f'{file_id}{ext}'
    target = upload_root() / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)

    stored = StoredFile(id=file_id, original_name=_clean_name(original_name), content_type=content_type,
                        size=len(data), storage_path=relative.as_posix(), uploaded_by=uploaded_by)
    db.add(stored)
    return stored


def file_path(stored: StoredFile) -> Path:
    """Absolute path of a stored file; refuses anything that points outside UPLOAD_DIR."""
    root = upload_root()
    path = (root / stored.storage_path).resolve()
    if root not in path.parents or not path.is_file():
        raise ServiceError('The file could not be found.', 404)
    return path
