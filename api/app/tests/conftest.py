from unittest.mock import AsyncMock

import pytest
from pytest_mock import MockerFixture

mock_session = AsyncMock()


class MockScalars:
    def __init__(self, entities) -> None:
        self.entities = entities

    def unique(self):
        return self

    def all(self):
        return self.entities


@pytest.fixture(scope="function", autouse=True)
def mock_db_transaction_fn(mocker: MockerFixture):
    mocker.patch("app.core.db.AsyncDBSession", mock_session)
    yield
    mock_session.reset_mock()
