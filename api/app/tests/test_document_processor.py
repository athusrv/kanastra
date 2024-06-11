from datetime import datetime
import uuid
import pytest
from app.api.models.document_status import DocumentStatus
from app.processors.document import DocumentProcessor
from pytest_mock import MockerFixture


@pytest.fixture
def processor():
    return DocumentProcessor()


@pytest.fixture
def bills():
    return [
        b"Elijah Santos,9558,janet95@example.com,7811,2024-01-19,ea23f2ca-663a-4266-a742-9da4c9f4fcb3"
    ]


@pytest.mark.asyncio
async def test_bill_processor(processor, bills, mocker: MockerFixture):
    document_id = uuid.uuid4()
    cells = bills[0].decode("utf-8").strip().split(",")

    craete_fn = mocker.patch.object(processor.bill_repository, "create")
    doc_update_fn = mocker.patch.object(processor.doc_repository, "update")

    result = await processor.process(bills, document_id)

    assert not doc_update_fn.called
    assert craete_fn.called
    assert result == document_id
    assert craete_fn.call_args[1]["document_id"] == document_id
    assert craete_fn.call_args[1]["name"] == cells[0]
    assert craete_fn.call_args[1]["government_id"] == cells[1]
    assert craete_fn.call_args[1]["email"] == cells[2]
    assert craete_fn.call_args[1]["debt_amount"] == cells[3]
    assert (
        craete_fn.call_args[1]["debt_due_date"]
        == datetime.fromisoformat(cells[4]).date()
    )
    assert craete_fn.call_args[1]["debt_id"] == cells[5]


@pytest.mark.asyncio
async def test_bill_processor_fail(processor, bills, mocker: MockerFixture):
    async def _create():
        raise Exception()

    mocker.patch.object(processor.bill_repository, "create", _create)
    update_fn = mocker.patch.object(processor.doc_repository, "update")
    document_id = uuid.uuid4()
    with pytest.raises(Exception) as exc:
        await processor.process(bills, document_id)

        assert exc is not None
        assert update_fn.call_args[0][0] == document_id
        assert update_fn.call_args[0][1] == {"status": DocumentStatus.FAILED}
