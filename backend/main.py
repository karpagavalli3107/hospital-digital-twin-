
# Fix SSL certificate verification on Windows
import truststore
truststore.inject_into_ssl()

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase

# Load Neo4j credentials from environment variables
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parents[2] / "backend" / ".env"

if ENV_FILE.is_file():
    load_dotenv(dotenv_path=ENV_FILE)
else:
    load_dotenv()

# Connect to Neo4j Aura
driver = GraphDatabase.driver(
    os.environ["NEO4J_URI"],
    auth=(
        os.environ["NEO4J_USERNAME"],
        os.environ["NEO4J_PASSWORD"]
    )
)

DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")


# Manage database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    driver.verify_connectivity()
    print("Neo4j connected successfully!")
    yield
    driver.close()


# Create FastAPI application
app = FastAPI(
    title="Patient Digital Twin",
    lifespan=lifespan
)


# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://hospital-digital-twin-phi.vercel.app",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Patient Digital Twin API Running"
    }


# Database health endpoint
@app.get("/health")
def health():
    try:
        with driver.session(database=DATABASE) as session:
            result = session.run(
                "MATCH (n) RETURN count(n) AS total"
            )
            count = result.single()["total"]

        return {
            "status": "connected",
            "total_nodes": count
        }

    except Exception as e:
        print("NEO4J ERROR:", type(e).__name__)
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )


# Retrieve all patients
@app.get("/patients")
def get_patients():
    try:
        with driver.session(database=DATABASE) as session:
            result = session.run("""
                MATCH (p:Patient)
                RETURN
                    p.patientId AS patientId,
                    p.name AS name,
                    p.age AS age,
                    p.city AS city
                ORDER BY patientId
            """)

            patients = [record.data() for record in result]

        return {
            "total": len(patients),
            "patients": patients
        }

    except Exception as e:
        print("PATIENT QUERY ERROR:", type(e).__name__)
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve patients"
        )


# Retrieve a patient's complete Digital Twin
@app.get("/patients/{patient_id}/digital-twin")
def get_patient_digital_twin(patient_id: int):
    query = """
    MATCH (p:Patient)
    WHERE p.patientId = $patient_id

    OPTIONAL MATCH (p)-[:HAS_DIGITAL_TWIN]->(dt:DigitalTwin)

    CALL (p) {
        OPTIONAL MATCH (p)-[:HAS_VITAL_SIGNS]->(v:VitalSigns)
        RETURN collect(DISTINCT properties(v)) AS vitalSigns
    }

    CALL (p) {
        OPTIONAL MATCH (p)-[:HAS_MEDICAL_HISTORY]->(h:MedicalHistory)
        RETURN collect(DISTINCT properties(h)) AS medicalHistory
    }

    CALL (p) {
        OPTIONAL MATCH (p)-[:HAS_LAB_REPORT]->(l:LabReport)
        RETURN collect(DISTINCT properties(l)) AS labReports
    }

    CALL (p) {
        OPTIONAL MATCH (p)-[:HAS_PRESCRIPTION]->(rx:Prescription)
        OPTIONAL MATCH (rx)-[:PRESCRIBES]->(m:Medicine)
        RETURN collect(DISTINCT {
            prescription: properties(rx),
            medicine: properties(m)
        }) AS prescriptions
    }

    CALL (p) {
        OPTIONAL MATCH (p)-[:HAS_APPOINTMENT]->(a:Appointment)
        OPTIONAL MATCH (a)-[:WITH_DOCTOR]->(d:Doctor)
        RETURN collect(DISTINCT {
            appointment: properties(a),
            doctor: properties(d)
        }) AS appointments
    }

    RETURN
        properties(p) AS patient,
        properties(dt) AS digitalTwin,
        vitalSigns,
        medicalHistory,
        labReports,
        prescriptions,
        appointments
    """

    try:
        with driver.session(database=DATABASE) as session:
            record = session.run(
                query,
                patient_id=patient_id
            ).single()

            if record is None:
                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )

            return record.data()

    except HTTPException:
        raise

    except Exception as e:
        print("DIGITAL TWIN QUERY ERROR:", type(e).__name__)
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve digital twin"
        )
