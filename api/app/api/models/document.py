from typing import List, Optional
from uuid import UUID

from . import BaseSchema
from .document_status import DocumentStatus


class DocumentResponse(BaseSchema):
    id: UUID
    filename: str
    status: DocumentStatus


class PaginatedDocumentResponse(BaseSchema):
    documents: List[DocumentResponse]
    total: int
    offset: int
    take: int
