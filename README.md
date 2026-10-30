# 🏥 Patient Digital Twin — Healthcare Management System

A web-based **Patient Digital Twin System** that provides an interactive digital representation of fictional patient health records using **React, FastAPI, and Neo4j Graph Database**.

The system connects patient information, medical history, vital signs, prescriptions, laboratory reports, and appointments into a unified dashboard.

## 🌐 Live Demo

**Website:** https://hospital-digital-twin-phi.vercel.app

**Backend API:** https://hospital-digital-twin-api.onrender.com

**API Documentation:** https://hospital-digital-twin-api.onrender.com/docs

> **Note:** This project uses fictional patient records for demonstration and educational purposes. It is not intended for clinical diagnosis or use with real patient data.

## ✨ Features

- **Patient Directory:** Browse fictional patient records.
- **Patient Search:** Search for patients through the web interface.
- **Digital Twin Dashboard:** View a patient's connected healthcare information.
- **Health Overview:** Display available health scores, risk levels, and patient status.
- **Vital Signs:** View heart rate, blood pressure, and body temperature.
- **Medical History:** Access recorded medical conditions.
- **Laboratory Reports:** View test names and results.
- **Prescriptions:** View prescribed medicines and associated details.
- **Appointments:** Display doctor and appointment information.
- **Graph-Based Data Storage:** Use Neo4j to model connected healthcare records.
- **Public Demo:** Access the demonstration website through a browser.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Python, FastAPI |
| Database | Neo4j Aura |
| Database Driver | Neo4j Python Driver |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git and GitHub |

## 🏗️ System Architecture

```text
           USER / WEB BROWSER
                   |
                   v
          REACT FRONTEND
          Hosted on Vercel
                   |
              HTTPS / API
                   |
                   v
          FASTAPI BACKEND
           Hosted on Render
                   |
           Neo4j Python Driver
                   |
                   v
          NEO4J AURA DATABASE
                   |
          Connected Patient Data
```

The frontend requests patient information from the FastAPI backend. The backend queries Neo4j and returns structured JSON responses, which React displays in the dashboard.

## 📁 Project Structure

```text
patient-digital-twin/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env              # Local only; never commit
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## 🚀 Running the Project Locally

### Prerequisites

- Python 3
- Node.js and npm
- Git
- A Neo4j database with the required demonstration data

### 1. Clone the Repository

```bash
git clone -b patient-website https://github.com/karpagavalli3107/hospital-digital-twin-.git
cd hospital-digital-twin-
```

### 2. Configure the Backend

Navigate to the backend folder:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend folder:

```env
NEO4J_URI=your_neo4j_connection_uri
NEO4J_USERNAME=your_neo4j_username
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=neo4j
```

Use your own Neo4j connection credentials. Do not commit the `.env` file to GitHub.

Start the backend:

```bash
uvicorn main:app --reload --port 8001
```

Backend API documentation:

http://127.0.0.1:8001/docs

### 3. Run the Frontend

Open a separate terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite.

**API configuration:** The current frontend is configured to use the publicly deployed Render backend. To connect to a local backend, update the API URL in `frontend/src/App.jsx` and ensure that the backend CORS settings permit the frontend's local origin.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check backend and database connectivity |
| GET | `/patients` | Retrieve the patient directory |
| GET | `/patients/{patient_id}/digital-twin` | Retrieve connected Digital Twin data for a patient |

### Example API Request

```http
GET /patients/101/digital-twin
```

The response includes available patient details, Digital Twin information, vital signs, medical history, lab reports, prescriptions, and appointments.

## 🗄️ Neo4j Graph Database

Neo4j is used to represent healthcare information through connected graph data.

The project retrieves relationships between patient records and related medical information, such as:

- Digital Twin information
- Vital signs
- Medical history
- Lab reports
- Prescriptions and medicines
- Appointments and doctors

This graph-based approach supports retrieving connected information for a patient through the backend API.

## ☁️ Deployment

### Frontend — Vercel

The React frontend is deployed using Vercel.

Live URL: https://hospital-digital-twin-phi.vercel.app

### Backend — Render

The FastAPI backend is deployed using Render.

API URL: https://hospital-digital-twin-api.onrender.com

Neo4j credentials must be configured as environment variables on the backend hosting service.

## 🔐 Security and Privacy

This project is a public educational demonstration.

- All demonstration patient records must be fictional.
- Neo4j credentials must remain private.
- Environment files containing secrets must not be committed to GitHub.
- Database access should occur through the backend, not directly from the browser.
- Real patient records must not be uploaded to this public demo.

Authentication, authorization, auditing, encryption controls, and other appropriate safeguards would be required before adapting the system for real healthcare information.

## 🔮 Future Enhancements

- Secure user authentication and role-based access
- Patient-specific health trends and charts
- Interactive Neo4j relationship visualization
- Real-time health monitoring integrations
- Predictive risk analysis
- Appointment management workflows
- Enhanced privacy and audit controls

## 📌 Project Purpose

This project demonstrates how a graph database and modern web technologies can be combined to build an interactive healthcare information dashboard.

The current Digital Twin represents a patient's connected medical information and recorded health status. It does not simulate physiological processes or independently predict medical outcomes.

## 📄 Disclaimer

This application is developed for educational and demonstration purposes only. It does not provide medical advice, diagnosis, or treatment recommendations.
