import uuid

import pytest
from faker import Faker
from pytest_mock import MockerFixture

from app.api.models.document_status import DocumentStatus
from app.api.repositories.document import DocumentRepository
from app.core.domains.tables import Document
from app.tests.conftest import mock_session

fake = Faker()


@pytest.fixture
def repository():
    return DocumentRepository()


@pytest.fixture
def document():
    return Document(
        filename=fake.name(),
        status=DocumentStatus.PROCESSING,
    )


@pytest.mark.asyncio
async def test_get_document(repository, document, mocker: MockerFixture):
    id = uuid.uuid4()
    created_at = fake.date_time()
    mocker.patch.object(
        mock_session,
        "scalar",
        return_value=Document(
            id=id,
            created_at=created_at,
            filename=document.filename,
            status=document.status,
        ),
    )
    result = await repository.get(id)

    assert result.id == id
    assert result.filename == document.filename
    assert result.created_at == created_at
    assert result.status == document.status

    assert mock_session.scalar.call_count == 1


@pytest.mark.asyncio
async def test_get_all(repository, document, mocker: MockerFixture):
    class ScalarsClass:
        def all(self):
            return [document]

    mocker.patch.object(mock_session, "scalars", return_value=ScalarsClass())
    result = await repository.get_all()

    assert result[0].filename == document.filename
    assert result[0].status == document.status


@pytest.mark.asyncio
async def test_total(repository, mocker: MockerFixture):
    mocker.patch.object(mock_session, "scalar", return_value=2)
    result = await repository.total()

    assert result == 2


@pytest.mark.asyncio
async def test_total_if_none(repository, mocker: MockerFixture):
    mocker.patch.object(mock_session, "scalar", return_value=None)
    result = await repository.total()

    assert result == 0


@pytest.mark.asyncio
async def test_create_document(repository, document):
    result = await repository.create(
        filename=document.filename,
        status=document.status,
    )

    assert result.filename == document.filename
    assert result.status == document.status

    assert mock_session.add.call_count == 1
    assert mock_session.flush.call_count == 1


@pytest.mark.asyncio
async def test_update_document(repository, document, mocker: MockerFixture):
    mocker.patch.object(mock_session, "scalar", return_value=document)
    result = await repository.update(document.id, {})

    assert result.filename == document.filename
    assert result.status == document.status
