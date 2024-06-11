## Getting Started

### Pre-requisites

- Python 3.12+
- Docker

### Local development + tests

1. Make sure you're in a [virtual environment](https://docs.python.org/3/library/venv.html)
   - `python -m venv venv`
   - `. ./venv/bin/activate` for unix-based OS. For other OS, visit the link above
2. Install poetry: `pip install poetry`
3. Install dependencies: `poetry install --no-root`
4. With packages installed, run: `docker-compose up -d`
5. When the container is up and running, run migrations: `alembic upgrade head`
6. For tests: `pytest`

Visit http://localhost:5002/docs to check the API documentation

## Technical decisions:

- [Celery](https://docs.celeryq.dev/en/stable/) for scheduling heavy tasks to run in the background and to schedule periodic tasks
- [Redis](https://redis.io/) for broker and results backend used by Celery workers
- [Flower](https://flower.readthedocs.io/en/latest/) as the Celery process monitor, available at http://localhost:5555
- [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) as the ORM
- [PostgreSQL](https://www.postgresql.org/) as the database running on port 5435
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations
- [FastAPI](https://fastapi.tiangolo.com/) for building the REST API which will run on port 5002
- SSE (Server Sent Events) for server-client communication
- [Pytest](https://docs.pytest.org/en/8.2.x/) for unit and integration tests

## Considerations

The time to process a single file depends on the file itself and the amount of concurrent workers working to process that file.

I noticed that the test file is huge, more than 100MB of pure text. Currently, this project is set to use 10 workers concurrently at maximum. Increasing this number is possible by adding the `-c` argument to the worker command:

On `docker-compose.yml`

```diff
- celery -A app.worker.celery worker -B --loglevel=DEBUG --logfile=logs/celery.log`
+ celery -A app.worker.celery worker -B -c 30 --loglevel=DEBUG --logfile=logs/celery.log
```

> Restart docker containers: `docker-compose up -d`

Note that increasing this number depends on several aspects of scalability and certain values might not work well. You may try, it might depend on your machine capabilities and on the Docker resources you have available.

## Billing and Email notification tasks

For billing generation and email notifications, I decided to delegate to Celery this task. In the `app/workers.py` file we have this snippet:

```python
celery.conf.beat_schedule = {
    "generate_bills": {
        "task": "app.worker.generate_bill_task",
        "schedule": schedules.crontab()
    }
}
```

It's essentially scheduling the `generate_bill_task` to run at a specific time interval defined by the arguments of `schedules.crontab()`.

To see this task running at every minute, visit the Flower dashboard (http://locahost:5555)

## Caveats

In order to run tasks concurrently and process a file faster, I decided to use [Celery Task Groups](https://docs.celeryq.dev/en/stable/userguide/canvas.html#groups).

The problem with this workflow is that if a task fails, the other taks will continue, however the document will still be marked as failed.

It might be the desired workflow for some cases, however it might not be for others.

Celery documentation causes headackes. There are many gaps there which might lead you to take long time researching on how to do some specific stuff, like for example: how to kill a group task if one task of this group fails.
