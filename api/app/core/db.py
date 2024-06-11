import asyncio
import os
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

async_engine = create_async_engine(os.environ["SQLALCHEMY_DB_URL"], echo=False)

AsyncDBSession = async_scoped_session(
    async_sessionmaker(async_engine, expire_on_commit=False), asyncio.current_task
)


@asynccontextmanager
async def transaction():
    """Provide a transactional scope around a series of operations."""
    try:
        yield AsyncDBSession
        await AsyncDBSession.commit()
    except Exception:
        await AsyncDBSession.rollback()
        raise
    finally:
        await AsyncDBSession.close()
