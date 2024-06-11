from abc import ABC, abstractmethod

from ..core.db import AsyncDBSession


class Processor(ABC):
    @abstractmethod
    async def process(self, *args, **kwargs):
        pass


class DatabaseDependentProcessor(Processor):
    async def run(self, *args, **kwargs):
        pass

    async def process(self, *args, **kwargs):
        try:
            return await self.run(*args, **kwargs)
        finally:
            await self.cleanup()

    async def cleanup(self):
        await AsyncDBSession.remove()
