from datetime import date

import sqlalchemy as sa

from ...core import db
from ...core.domains.tables import Bill, Document
from ..models.bill_status import BillStatus
from ..models.document_status import DocumentStatus


class BillRepository:
    async def create(
        self,
        document_id,
        name,
        government_id,
        email,
        debt_amount,
        debt_due_date,
        debt_id,
    ):
        async with db.transaction() as txn:
            bill = Bill(
                document_id=document_id,
                name=name,
                government_id=government_id,
                email=email,
                debt_amount=debt_amount,
                debt_due_date=debt_due_date,
                debt_id=debt_id,
                status=BillStatus.PENDING,
            )
            txn.add(bill)
            await txn.flush()

            return bill

    async def upcoming(self, start: date, end: date):
        async with db.transaction() as txn:
            q = await txn.scalars(
                sa.select(Bill)
                .join(Document)
                .where(
                    Document.status == DocumentStatus.COMPLETE,
                    Bill.status != BillStatus.COMPLETE,
                    Bill.debt_due_date.between(start, end),
                )
            )

            return q.unique().all()

    async def update(self, id, data: dict, *args, **kwargs) -> Document:
        async with db.transaction() as txn:
            return await txn.scalar(
                sa.update(Bill).where(Bill.id == id).values(**data).returning(Bill)
            )
