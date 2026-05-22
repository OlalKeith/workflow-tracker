# Workflow Tracker

A mini application workflow tracker built with Django + Django Ninja (backend) and React + Vite + shadcn/ui (frontend).

**James Olal — jkeneth.jk@gmail.com**

---

## Stack

- **Backend:** Python, Django, Django Ninja, SQLite
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router, Axios

---

## Workflow

```
Draft → Submitted → Under Review → Approved / Rejected / Need More Information
```

Need More Information applications can be edited and resubmitted.

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node 18+
- pip

---

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install django django-ninja pillow python-dotenv
```

#### Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Start the server

```bash
python manage.py runserver
```

API runs at `http://127.0.0.1:8000/api/`  
Interactive API docs at `http://127.0.0.1:8000/api/docs`

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

> Make sure the Django backend is running before starting the frontend.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/` | Create draft |
| GET | `/api/applications/` | List all applications |
| GET | `/api/applications/{id}` | Get application details |
| PUT | `/api/applications/{id}` | Update draft |
| POST | `/api/applications/{id}/submit` | Submit application |
| POST | `/api/applications/{id}/start-review` | Move to Under Review |
| POST | `/api/applications/{id}/decision` | Record reviewer decision |

---

## Assumptions

- No authentication — any user can create or review applications. A real system would separate applicant and reviewer roles.
- SQLite is used for simplicity. Production would use PostgreSQL.
- CORS is open (`ALLOWED_HOSTS = ['*']`) for local development.
- Tracking numbers are auto-generated on draft creation using a UUID-based format (`TRK-XXXXXXXX`).

---

## What I Would Improve With More Time

- Add authentication with role separation (Applicant vs Reviewer)
- Paginate the application list
- Add filtering and search by status, type, and date
- Email notifications on status changes
- Replace SQLite with PostgreSQL
- Write unit tests for workflow transition rules
- Add a proper CI pipeline