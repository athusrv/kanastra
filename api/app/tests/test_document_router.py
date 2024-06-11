import uuid
from typing import List
from unittest.mock import AsyncMock, Mock

import pytest
from pydantic import ValidationError
from pytest_mock import MockerFixture

from app.api.models.document import DocumentResponse
from app.api.models.document_status import DocumentStatus
from app.api.routers.document import get, get_all, upload


@pytest.fixture
def mock_service(mocker: MockerFixture):
    mock_service = AsyncMock()
    mocker.patch("app.api.routers.document.service", mock_service)
    return mock_service


@pytest.mark.asyncio
async def test_upload(mock_service):
    mock_service.process_file.return_value = DocumentResponse(
        filename="", id=uuid.uuid4(), status=DocumentStatus.COMPLETE
    )
    file = Mock()
    result = await upload(file)

    assert mock_service.process_file.called
    assert mock_service.process_file.call_args[0][0] == file
    assert isinstance(result, DocumentResponse)


@pytest.mark.asyncio
async def test_upload_validation_error(mock_service):
    mock_service.process_file.return_value = DocumentResponse(
        filename="", id=uuid.uuid4(), status=DocumentStatus.COMPLETE
    )

    file = Mock()
    with pytest.raises(ValidationError) as exc:
        mock_service.process_file.return_value = DocumentResponse()
        await upload(file)

        assert exc is not None


@pytest.mark.asyncio
async def test_get_all(mock_service):
    mock_service.get_all.return_value = [
        DocumentResponse(filename="", id=uuid.uuid4(), status=DocumentStatus.COMPLETE)
    ]
    result = await get_all()

    assert mock_service.get_all.called
    assert mock_service.get_all.call_args[0][0] == 0
    assert mock_service.get_all.call_args[0][1] == 20
    assert isinstance(result, list)


@pytest.mark.asyncio
async def test_get_all(mock_service):
    mock_service.get.return_value = DocumentResponse(
        filename="", id=uuid.uuid4(), status=DocumentStatus.COMPLETE
    )
    id = uuid.uuid4()
    result = await get(id)

    assert mock_service.get.called
    assert mock_service.get.call_args[0][0] == id
    assert isinstance(result, DocumentResponse)
