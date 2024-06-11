import datetime
import enum
from dataclasses import dataclass
from typing import Any, List, Optional
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy import JSON, TIMESTAMP, Enum, orm

from app.api.models.bill_status import BillStatus
from app.api.models.document_status import DocumentStatus

Base = orm.declarative_base(
    type_annotation_map={
        datetime.datetime: TIMESTAMP(timezone=True),
        dict[str, Any]: JSON,
        enum.Enum: Enum(enum.Enum),
    }
)


@dataclass
class Document(Base):
    __tablename__ = "document"

    id: orm.Mapped[UUID] = orm.mapped_column(
        primary_key=True, server_default=sa.text("uuid_generate_v4()")
    )
    filename: orm.Mapped[str]
    status: orm.Mapped[DocumentStatus]
    created_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
        server_default=sa.func.now()
    )

    bills: orm.Mapped[List["Bill"]] = orm.relationship(lazy="noload")


@dataclass
class Bill(Base):
    __tablename__ = "bill"

    id: orm.Mapped[UUID] = orm.mapped_column(
        primary_key=True, server_default=sa.text("uuid_generate_v4()")
    )
    document_id: orm.Mapped[UUID] = orm.mapped_column(sa.ForeignKey("document.id"))
    name: orm.Mapped[str]
    government_id: orm.Mapped[str]
    email: orm.Mapped[str]
    debt_amount: orm.Mapped[str]
    debt_due_date: orm.Mapped[datetime.date]
    debt_id: orm.Mapped[UUID]
    status: orm.Mapped[BillStatus]
    created_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
        server_default=sa.func.now()
    )
    updated_at: orm.Mapped[Optional[datetime.datetime]]
