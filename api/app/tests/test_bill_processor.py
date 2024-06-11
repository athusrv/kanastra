import uuid
from datetime import datetime, timedelta

import pytest
from pytest_mock import MockerFixture

from app.api.models.bill_status import BillStatus
from app.core.domains.tables import Bill
from app.processors.bill import BillProcessor


@pytest.mark.asyncio
async def test_bill_processor(freezer, mocker: MockerFixture):
    processor = BillProcessor()

    bill_id = uuid.uuid4()
    upcoming_fn = mocker.patch.object(
        processor.repository, "upcoming", return_value=[Bill(id=bill_id)]
    )
    update_fn = mocker.patch.object(processor.repository, "update")
    cleanup_fn = mocker.patch.object(processor, "cleanup")
    now = datetime.now()
    await processor.process()

    assert upcoming_fn.call_args[0][0] == now.date()
    assert upcoming_fn.call_args[0][1] == now.date() + timedelta(days=15)
    assert update_fn.call_args[0][0] == bill_id
    assert update_fn.call_args[0][1] == {"status": BillStatus.COMPLETE}

    assert cleanup_fn.called
