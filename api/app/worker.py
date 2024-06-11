import os
from uuid import UUID

from asgiref import sync
from celery import Celery, schedules

from .processors.bill import BillProcessor
from .processors.document import CompleteDocumentProcessor, DocumentProcessor

celery = Celery(
    __name__,
    broker=os.environ["CELERY_BROKER_URL"],
    backend=os.environ["CELERY_RESULT_BACKEND"],
)


@celery.task()
def process_document(lines, document_id: UUID):
    try:
        processor = DocumentProcessor()
        func = sync.AsyncToSync(processor.process)
        return func(lines, document_id)
    except:
        raise


@celery.task
def complete_document(args):
    document_id = args[0] if not isinstance(args, UUID) else args
    processor = CompleteDocumentProcessor()
    func = sync.AsyncToSync(processor.process)
    return func(document_id)


@celery.task
def generate_bill_task():
    processor = BillProcessor()
    func = sync.AsyncToSync(processor.process)
    func()


celery.conf.beat_schedule = {
    "generate_bills": {
        "task": "app.worker.generate_bill_task",
        "schedule": schedules.crontab(),  # Change the interval pattern here. At this moment, this task is running at every minute
    }
}
