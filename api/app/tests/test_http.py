import os
from datetime import datetime
from posixpath import abspath
from uuid import uuid4

import pytest
from faker import Faker
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

from app.api.models.document_status import DocumentStatus
from app.core.domains.tables import Document
from app.main import app
from app.tests.conftest import MockScalars, mock_session

fake = Faker()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.mark.asyncio
async def test_get_document(client, mocker: MockerFixture):
    id = uuid4()
    document = Document(
        id=id,
        filename=fake.file_name(extension="csv"),
        created_at=datetime.now(),
        status=DocumentStatus.COMPLETE,
    )

    mocker.patch.object(mock_session, "scalar", return_value=document)
    response = client.get(f"/document/{id}")
    json = response.json()
    assert response.status_code == 200

    assert json["id"] == str(document.id)
    assert json["filename"] == str(document.filename)
    assert json["status"] == document.status.value
    assert not json.get("created_at")


@pytest.mark.asyncio
async def test_get_no_document(client, mocker: MockerFixture):
    mocker.patch.object(mock_session, "scalar", return_value=None)
    response = client.get(f"/document/{uuid4()}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_all_document(client, mocker: MockerFixture):
    documents = [
        Document(
            id=fake.uuid4(cast_to=None),
            filename=fake.file_name(extension="csv"),
            created_at=datetime.now(),
            status=DocumentStatus.COMPLETE,
        )
    ]

    mocker.patch.object(mock_session, "scalars", return_value=MockScalars(documents))
    mocker.patch(
        "app.api.repositories.document.DocumentRepository.total",
        return_value=len(documents),
    )
    response = client.get(f"/document")
    json = response.json()
    assert response.status_code == 200

    item = json["documents"]
    assert json["total"] == len(documents)

    for i in range(len(documents)):
        assert item[i]["id"] == str(documents[i].id)
        assert item[i]["filename"] == str(documents[i].filename)
        assert item[i]["status"] == documents[i].status.value
        assert not item[i].get("created_at")


@pytest.mark.asyncio
async def test_upload_file(client, mocker: MockerFixture):
    id = uuid4()

    def _add(entity):
        entity.id = id

    mocker.patch("app.core.db.AsyncDBSession.add", _add)
    celery_chain = mocker.patch("celery.chain")
    curpath = os.path.abspath(__file__)

    with open(abspath(f"{curpath}/../test_input.csv"), "rb") as file:
        response = client.post(
            "/document", files={"file": ("input.csv", file, "text/csv")}
        )
        json = response.json()
        assert response.status_code == 200
        assert json["id"] == str(id)
        assert json["filename"] == "input.csv"
        assert celery_chain.called
        assert len(celery_chain.call_args) == 2
