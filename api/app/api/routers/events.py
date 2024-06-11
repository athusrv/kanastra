import asyncio
from uuid import UUID

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.api.models.document_status import DocumentStatus
from app.api.services.document import DocumentService

router = APIRouter(prefix="/events", tags=["Events"])
service = DocumentService()


async def event_generator(id: UUID, request: Request):
    signal = []
    while len(signal) == 0:
        try:
            if await request.is_disconnected():
                raise Exception("request is disconnected")

            document = await service.get(id)
            if not document:
                raise Exception("document not found")
            if document.status in [DocumentStatus.COMPLETE, DocumentStatus.FAILED]:
                event = "complete"
                if document.status == DocumentStatus.FAILED:
                    event = "failed"

                yield f"event: {event}\nid: {document.id}\nretry: 15000\ndata: {document.status.value}\r\n\r\n".encode(
                    "utf-8"
                )
                signal.append("done!")
        except Exception as e:
            signal.extend(["exception", e])
        await asyncio.sleep(5)


@router.get("/{id}")
async def listen(id: UUID, request: Request):
    """Listen to a document status change. {id} is the document id"""
    return StreamingResponse(
        event_generator(id, request), media_type="text/event-stream"
    )
