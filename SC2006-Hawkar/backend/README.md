# Setup Instructions (Backend)

1. In the `/backend` directory, create a python virtual environment and activate it.

```bash
python -m venv .venv
. .venv/bin/activate # The .venv activation command might differ depending on your operating system
```

2. Install the required packages.

```bash
pip install -r requirements.txt
```

3. In the `/backend/app` directory, start the application.

```bash
cd app
uvicorn main:app --reload
```
The server application is running on http://127.0.0.1:8000/

# Database Seeding

If you would like to seed the database with pre-configured data, please uncomment the following line in the `backend/app/main.py` before re-starting the application.

```python
# app/main.py
# add_event_listener_to_seed_database()
```

_Note: Please ensure that the `sql_app.db` in the app directory is deleted before re-starting the application._
