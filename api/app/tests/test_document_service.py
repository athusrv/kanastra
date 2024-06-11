import uuid
from unittest.mock import MagicMock

import celery
import pytest
from faker import Faker

from app.api.models.document_status import DocumentStatus
from app.api.services.document import DocumentService
from app.core.domains.tables import Document
from pytest_mock import MockerFixture

fake = Faker()


@pytest.fixture
def service():
    return DocumentService()


@pytest.fixture
def document():
    return Document(
        id=uuid.uuid4(),
        filename=fake.file_name(extension="csv"),
        status=DocumentStatus.COMPLETE,
        created_at=fake.date_time,
    )


@pytest.mark.asyncio
async def test_process_file(service, document, mocker: MockerFixture):

    class MockCeleryChain:
        def __init__(self, *args) -> None:
            pass

        def delay(self):
            pass

    celery_chain_mock = MagicMock(MockCeleryChain)

    mocker.patch.object(service.repository, "create", return_value=document)
    mocker.patch.object(celery, "chain", return_value=celery_chain_mock)
    file = MagicMock()

    result = await service.process_file(file)

    assert result == document
    assert file.file.readlines.call_count == 1
    celery_chain_mock.delay.assert_called_once()


@pytest.mark.asyncio
async def test_get_all(service, document, mocker: MockerFixture):
    documents = [document]
    mocker.patch.object(service.repository, "get_all", return_value=documents)
    mocker.patch.object(service.repository, "total", return_value=len(documents))

    result = await service.get_all()

    assert len(result.documents) == 1
    assert result.documents[0] == document
    assert result.total == len(documents)


@pytest.mark.asyncio
async def test_get_all(service, document, mocker: MockerFixture):
    mocker.patch.object(service.repository, "get", return_value=document)

    result = await service.get(document.id)

    assert result == document


@pytest.mark.asyncio
async def test_set_status(service, document, mocker: MockerFixture):
    async def _update(id, data):
        return Document(
            id=id,
            filename=document.filename,
            created_at=document.created_at,
            **data,
        )

    mocker.patch.object(service.repository, "update", _update)
    result = await service.set_status(document.id, DocumentStatus.FAILED)

    assert result.status == DocumentStatus.FAILED
