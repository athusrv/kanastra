from datetime import datetime, timedelta

from ..api.models.bill_status import BillStatus
from ..api.repositories.bill import BillRepository
from ..core.domains.tables import Bill
from ..notifiers.email import EmailNotifier
from ..processors import DatabaseDependentProcessor


class BillGenerator:
    @staticmethod
    async def generate(line: Bill):
        print("Logic for bill (boleto) generation goes here")
        return {}


class BillProcessor(DatabaseDependentProcessor):
    def __init__(self) -> None:
        self.repository = BillRepository()
        self.notifier = EmailNotifier()

    async def run(self):
        start = datetime.now().date()
        end = start + timedelta(days=15)
        bills = await self.repository.upcoming(start, end)

        for bill in bills:
            generate_bill = await BillGenerator.generate(bill)
            await self.notifier.notify(generate_bill)

            await self.repository.update(bill.id, {"status": BillStatus.COMPLETE})
