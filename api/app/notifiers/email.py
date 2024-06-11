from app.notifiers import Notifier


class EmailNotifier(Notifier):
    async def notify(self, *args, **kwargs):
        print("Email notification. Logic implementation goes here")
