from datetime import datetime
from typing import List
from uuid import UUID

from ..api.models.document_status import DocumentStatus
from ..api.repositories.bill import BillRepository
from ..api.repositories.document import DocumentRepository
from . import DatabaseDependentProcessor


class CompleteDocumentProcessor(DatabaseDependentProcessor):
    def __init__(self) -> None:
        self.repository = DocumentRepository()
        super().__init__()

    async def run(self, document_id):
        await self.repository.update(document_id, {"status": DocumentStatus.COMPLETE})
        return document_id


class DocumentProcessor(DatabaseDependentProcessor):
    def __init__(self) -> None:
        self.bill_repository = BillRepository()
        self.doc_repository = DocumentRepository()
        super().__init__()

    async def run(self, bills: List[bytes], document_id: UUID):
        for bill in bills:
            cells = bill.decode("utf-8").strip().split(",")
            try:
                await self.bill_repository.create(
                    document_id=document_id,
                    name=cells[0],
                    government_id=cells[1],
                    email=cells[2],
                    debt_amount=cells[3],
                    debt_due_date=datetime.fromisoformat(cells[4]).date(),
                    debt_id=cells[5],
                )
            except Exception:
                await self.doc_repository.update(
                    document_id, {"status": DocumentStatus.FAILED}
                )
                raise

        return document_id
