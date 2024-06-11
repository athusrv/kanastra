from pydoc import doc
from uuid import UUID

import celery
from fastapi import UploadFile

from app.api.models.document import PaginatedDocumentResponse
from app.worker import complete_document, process_document

from ..models.document_status import DocumentStatus
from ..repositories.document import DocumentRepository


def chunk(it, n):
    for i in range(0, len(it), n):
        yield it[i : i + n]


class DocumentService:
    def __init__(self) -> None:
        self.repository = DocumentRepository()

    async def process_file(self, file: UploadFile):
        document = await self.repository.create(
            filename=file.filename, status=DocumentStatus.PROCESSING
        )

        lines = file.file.readlines()
        nct = 110

        bgtask = celery.chain(
            celery.group(
                process_document.s(part, document.id)
                for part in chunk(lines[1:100000], nct)
            ),
            complete_document.s(),
        )

        bgtask.delay()

        return document

    async def get_all(self, offset: int = 0, take: int = 20):
        total = await self.repository.total()
        docs = await self.repository.get_all(offset, take)

        return PaginatedDocumentResponse(
            documents=docs, total=total, offset=offset, take=take
        )

    async def get(self, id: UUID):
        return await self.repository.get(id)

    async def set_status(self, id: UUID, status: DocumentStatus):
        return await self.repository.update(id, {"status": status})
