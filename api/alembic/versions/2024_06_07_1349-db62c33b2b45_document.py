"""document

Revision ID: db62c33b2b45
Revises: 
Create Date: 2024-06-07 13:49:19.003602

"""

from pickle import TRUE
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "db62c33b2b45"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "document",
        sa.Column(
            "id",
            sa.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("uuid_generate_v4()"),
            nullable=False,
            index=True,
        ),
        sa.Column("filename", sa.String, nullable=False),
        sa.Column(
            "status",
            sa.String,
            nullable=False,
            index=True,
        ),
        sa.Column(
            "created_at", sa.DateTime, nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "bill",
        sa.Column(
            "id",
            sa.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("uuid_generate_v4()"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "document_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("document.id"),
            nullable=True,
            index=True,
        ),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("government_id", sa.String, nullable=False, index=True),
        sa.Column("email", sa.String, nullable=False, index=True),
        sa.Column("debt_amount", sa.String, nullable=False),
        sa.Column("debt_due_date", sa.Date, nullable=False, index=True),
        sa.Column("debt_id", sa.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column(
            "status",
            sa.String,
            nullable=False,
            index=True,
        ),
        sa.Column(
            "created_at", sa.DateTime, nullable=False, server_default=sa.func.now()
        ),
        sa.Column("updated_at", sa.DateTime, nullable=True),
    )


def downgrade() -> None:
    op.drop_table("bill")
    op.drop_table("document")

    op.execute('DROP EXTENSION IF EXISTS "uuid-ossp"')
