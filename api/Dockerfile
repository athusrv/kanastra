FROM python:3.12

ENV PATH="/root/.local/bin:${PATH}"
COPY . /kanastra-api
WORKDIR /kanastra-api

RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]