# PrimeTrade Backend Assignment

A REST API with JWT authentication, role-based access control, and a Next.js frontend.

---

## Tech Stack

**Backend:** FastAPI, PostgreSQL, SQLAlchemy, JWT  
**Frontend:** Next.js, Tailwind CSS, Axios

---

## Backend Setup

### Requirements

- Python 3.10+
- PostgreSQL

### Steps

1. Clone the repository

```bash
git clone https://github.com/yourusername/primetrade-backend.git
cd primetrade-backend
```

2. Create and activate virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory

```bash
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/primetrade
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAIL=admin@primetrade.ai
ADMIN_PASSWORD=Admin@123
```

5. Create the database

```bash
psql -U postgres -c "CREATE DATABASE primetrade;"
```

6. Run the server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://127.0.0.1:8000`  
API docs available at `http://127.0.0.1:8000/docs`

### Run with Docker

```bash
docker-compose up --build
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login, returns JWT | No |
| POST | `/api/v1/auth/admin/login` | Admin login | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |

### Tasks

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/v1/tasks` | Create task | User |
| GET | `/api/v1/tasks` | Get own tasks | User |
| GET | `/api/v1/tasks/{id}` | Get single task | User |
| PUT | `/api/v1/tasks/{id}` | Update task | User |
| DELETE | `/api/v1/tasks/{id}` | Delete task | User |
| GET | `/api/v1/admin/tasks` | Get all tasks | Admin |
| GET | `/api/v1/admin/users` | Get all users | Admin |

---

## Frontend Setup

### Requirements

- Node.js 18+

### Steps

1. Clone the repository

```bash
git clone https://github.com/yourusername/primetrade-frontend.git
cd primetrade-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

4. Run the development server

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

### Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Login page | Public |
| `/register` | Register page | Public |
| `/dashboard` | User task manager | User only |
| `/admin` | Admin dashboard | Admin only |

---

## Scalability Note

**Horizontal Scaling** — The API is stateless since authentication uses JWT tokens.
Multiple instances can run behind a load balancer (Nginx or AWS ALB) without shared state issues.

**Database Scaling** — PostgreSQL can be scaled using read replicas for heavy read
workloads. Indexed columns on `email` and `user_id` keep queries fast as data grows.

**Caching** — Redis can be added in front of `GET /tasks` and `GET /admin/tasks`
endpoints to reduce database load under high traffic.

**Microservices** — The `auth` and `tasks` modules are fully independent and can be
extracted into separate services with their own databases when the system grows.

**Deployment** — Dockerfile and docker-compose.yml included. Environment variables
managed via `.env` for easy migration to AWS Secrets Manager or similar tools.

---

## Default Admin Credentials

```
Email: admin@primetrade.ai
Password: Admin@123
```

---

## Log Files

Application logs are written to `app.log` in the project root.
