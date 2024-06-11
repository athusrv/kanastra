from uuid import UUID

from fastapi import APIRouter, HTTPException, UploadFile

from ..models.document import DocumentResponse, PaginatedDocumentResponse
from ..services.document import DocumentService

router = APIRouter(prefix="/document", tags=["Document"])
service = DocumentService()


@router.post("", response_model=DocumentResponse)
async def upload(file: UploadFile):
    """Upload a document for processing"""
    return await service.process_file(file)


@router.get("", response_model=PaginatedDocumentResponse)
async def get_all(offset: int = 0, take: int = 20):
    """Get all documents with pagination support"""
    return await service.get_all(offset, take)


@router.get("/{id}", response_model=DocumentResponse)
async def get(id: UUID):
    """Get a document by id"""
    document = await service.get(id)
    if not document:
        raise HTTPException(404)

    return document
