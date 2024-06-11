from enum import Enum


class DocumentStatus(Enum):
    PROCESSING = "PROCESSING"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"
