import datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest

from app.api.models.bill_status import BillStatus
from app.api.models.document_status import DocumentStatus
from app.core.domains.tables import Bill
from app.worker import complete_document, generate_bill_task, process_document


def test_generate_bill_task(freezer, mocker, capfd):
    bills = [Bill(id=uuid4())]
    upcoming_mock = mocker.patch(
        "app.api.repositories.bill.BillRepository.upcoming", return_value=bills
    )
    update_mock = mocker.patch("app.api.repositories.bill.BillRepository.update")

    generate_bill_task()
    now = datetime.datetime.now()
    end = now + datetime.timedelta(days=15)
    out, _ = capfd.readouterr()
    outs = out.split("\n")
    assert outs[0] == "Logic for bill (boleto) generation goes here"
    assert outs[1] == "Email notification. Logic implementation goes here"
    assert upcoming_mock.called
    assert upcoming_mock.call_args[0][0] == now.date()
    assert upcoming_mock.call_args[0][1] == end.date()
    assert update_mock.called
    assert update_mock.call_args[0][0] == bills[0].id
    assert update_mock.call_args[0][1] == {"status": BillStatus.COMPLETE}


def test_complete_document(mocker):
    document_id = uuid4()
    update_mock = mocker.patch(
        "app.api.repositories.document.DocumentRepository.update",
        return_value=document_id,
    )
    complete_document(document_id)

    assert update_mock.called
    assert update_mock.call_args[0][0] == document_id
    assert update_mock.call_args[0][1] == {"status": DocumentStatus.COMPLETE}


def test_process_document(mocker):
    document_id = uuid4()

    update_doc_mock = mocker.patch(
        "app.api.repositories.document.DocumentRepository.update"
    )
    craete_bill_mock = mocker.patch("app.api.repositories.bill.BillRepository.create")

    lines = [
        b"Elijah Santos,9558,janet95@example.com,7811,2024-01-19,ea23f2ca-663a-4266-a742-9da4c9f4fcb3",
        b"Samuel Orr,5486,linmichael@example.com,5662,2023-02-25,acc1794e-b264-4fab-8bb7-3400d4c4734d",
    ]
    process_document(lines, document_id)

    assert not update_doc_mock.called
    assert craete_bill_mock.call_count == len(lines)


def test_process_document_exception(mocker):
    document_id = uuid4()

    update_doc_mock = mocker.patch(
        "app.api.repositories.document.DocumentRepository.update"
    )
    mocker.patch("app.api.repositories.bill.BillRepository.create")

    lines = [
        b"Elijah Santos,9558,janet95@example.com",
        b"Samuel Orr,5486,linmichael@example.com",
    ]

    with pytest.raises(Exception) as exc:
        process_document(lines, document_id)

        assert exc is not None
        assert update_doc_mock.called
        assert update_doc_mock.call_args[0][0] == document_id
        assert update_doc_mock.call_args[0][1] == {"status": DocumentStatus.FAILED}
