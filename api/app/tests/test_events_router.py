from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi.responses import StreamingResponse

from app.api.routers.events import listen


@pytest.mark.asyncio
async def test_listen():
    request = MagicMock()
    result = await listen(uuid4(), request)

    assert isinstance(result, StreamingResponse)
