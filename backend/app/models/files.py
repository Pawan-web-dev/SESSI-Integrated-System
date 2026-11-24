"""Files people upload (registration documents). The bytes are on disk; this table says where."""
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class StoredFile(TimestampMixin, Base):
    __tablename__ = 'stored_files'

    # random id, also the name on disk – never the name the user gave the file
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    original_name: Mapped[str] = mapped_column(String(200))
    content_type: Mapped[str] = mapped_column(String(60))
    size: Mapped[int] = mapped_column(Integer)
    # path relative to UPLOAD_DIR
    storage_path: Mapped[str] = mapped_column(String(300))
    # who uploaded it before having an account: the verified mobile number of the applicant
    uploaded_by: Mapped[str] = mapped_column(String(40), index=True)
