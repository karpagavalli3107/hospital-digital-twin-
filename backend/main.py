
# Fix SSL certificate verification on Windows
import truststore
truststore.inject_into_ssl()

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from neo4j import GraphDatabase

# Load credentials from .env
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
