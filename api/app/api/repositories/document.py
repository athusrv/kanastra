from uuid import UUID

import sqlalchemy as sa

from app.api.models.document_status import DocumentStatus

from ...core import db
from ...core.domains.tables import Document


class DocumentRepository:
    async def get(self, id: UUID):
        async with db.transaction() as txn:
            return await txn.scalar(sa.select(Document).where(Document.id == id))

    async def get_all(self, offset: int = 0, limit: int = 20):
        async with db.transaction() as txn:
            q = await txn.scalars(
                sa.select(Document)
                .offset(offset)
                .limit(limit)
                .order_by(sa.desc(Document.created_at))
            )

            return q.all()

    async def total(self):
        async with db.transaction() as txn:
            total = await txn.scalar(sa.select(sa.func.count(Document.id)))
            return total or 0

    async def create(self, filename: str, status: DocumentStatus):
        async with db.transaction() as txn:
            document = Document(filename=filename, status=status)
            txn.add(document)
            await txn.flush()

            return document

    async def update(self, id, data: dict, *args, **kwargs) -> Document:
        async with db.transaction() as txn:
            return await txn.scalar(
                sa.update(Document)
                .where(Document.id == id)
                .values(**data)
                .returning(Document)
            )
