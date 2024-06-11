import pytest
from faker import Faker
from pytest_mock import MockerFixture

from app.api.repositories.bill import BillRepository
from app.core.domains.tables import Bill
from app.tests.conftest import mock_session

fake = Faker()


@pytest.fixture
def repository():
    return BillRepository()


@pytest.fixture
def bill():
    return Bill(
        name=fake.name(),
        document_id=fake.uuid4(),
        debt_amount=fake.random_number(),
        debt_due_date=fake.date_object(),
        debt_id=fake.uuid4(),
        email=fake.email(),
        government_id=fake.uuid4(),
    )


@pytest.mark.asyncio
async def test_create_bill(repository, bill):
    result = await repository.create(
        name=bill.name,
        document_id=bill.document_id,
        debt_amount=bill.debt_amount,
        debt_due_date=bill.debt_due_date,
        debt_id=bill.debt_id,
        email=bill.email,
        government_id=bill.government_id,
    )

    assert result.document_id == bill.document_id
    assert result.document_id == bill.document_id
    assert result.debt_amount == bill.debt_amount
    assert result.debt_due_date == bill.debt_due_date
    assert result.debt_id == bill.debt_id
    assert result.email == bill.email
    assert result.government_id == bill.government_id

    assert mock_session.add.call_count == 1
    assert mock_session.flush.call_count == 1


@pytest.mark.asyncio
async def test_upcoming_bill(repository, bill, mocker: MockerFixture):
    class ScalarsClass:
        def unique(self):
            return self

        def all(self):
            return [bill]

    mocker.patch.object(mock_session, "scalars", return_value=ScalarsClass())
    result = await repository.upcoming(fake.date_object(), fake.date_object())

    assert result[0].document_id == bill.document_id
    assert result[0].document_id == bill.document_id
    assert result[0].debt_amount == bill.debt_amount
    assert result[0].debt_due_date == bill.debt_due_date
    assert result[0].debt_id == bill.debt_id
    assert result[0].email == bill.email
    assert result[0].government_id == bill.government_id


@pytest.mark.asyncio
async def test_upcoming_bill(repository, bill, mocker: MockerFixture):
    mocker.patch.object(mock_session, "scalar", return_value=bill)
    result = await repository.update(bill.id, {})

    assert result.document_id == bill.document_id
    assert result.document_id == bill.document_id
    assert result.debt_amount == bill.debt_amount
    assert result.debt_due_date == bill.debt_due_date
    assert result.debt_id == bill.debt_id
    assert result.email == bill.email
    assert result.government_id == bill.government_id
