# Upturnly Data App

A full-stack application built for exploring, filtering, and managing company and contact data.

## 🚀 Technologies Used

### Frontend
- **React 19** with Vite
- **TailwindCSS v4** for styling
- **Axios** for API requests
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3)
- **SQLAlchemy** for ORM
- **SQLite** as the database
- **Pandas** for processing uploaded CSV files

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **Nginx** (via frontend Dockerfile) for serving static files and proxying API requests

## 📂 Project Structure

- `/frontend` - Contains the React frontend code, Vite configuration, and Tailwind styling.
- `/backend` - Contains the FastAPI application, database models (SQLAlchemy), and data processing logic.
- `docker-compose.yml` - Defines the multi-container Docker application.

## 🛠️ Setup & Installation

The easiest way to run the application is using Docker.

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/SoundaryaDube/Upturnly-Data-App.git
   cd Upturnly-Data-App
   ```

2. Build and start the containers using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

3. Access the application:
   - **Frontend UI**: [http://localhost](http://localhost) (or `http://localhost:80` depending on your environment)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Local Development (Without Docker)

If you prefer to run the components separately for development:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📊 Features

- **CSV Upload**: Upload a CSV file containing contact and company data to dynamically populate the SQLite database.
- **Advanced Filtering**: Filter records by country, classification, industry, employee size logic, and exact search matching.
- **Data Table**: A comprehensive, paginated data grid to browse your target audience efficiently.
- **Data Clearing**: Reset your database completely with a single click.
