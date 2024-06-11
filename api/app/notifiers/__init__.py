from abc import ABC, abstractmethod


class Notifier(ABC):
    @abstractmethod
    async def notify(self, *args, **kwargs):
        pass
