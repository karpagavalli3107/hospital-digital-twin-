
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch("https://hospital-digital-twin-api.onrender.com/patients");

        if (!response.ok) {
          throw new Error("Unable to load patient records");
        }

        const data = await response.json();
        setPatients(data.patients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.patientId} ${patient.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🧬 MediTwin</h2>
        <p>Patient Digital Twin</p>

        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Patient Records</div>
          <div className="nav-item">Digital Twin</div>
        </nav>
      </aside>

      <main className="main">
        <header>
          <h1>Patient Digital Twin Dashboard</h1>
          <p>Live patient records from Neo4j</p>
        </header>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Patients</h3>
            <strong>{patients.length}</strong>
          </div>
          <div className="stat-card">
            <h3>Records Loaded</h3>
            <strong>{patients.length}</strong>
          </div>
          <div className="stat-card">
            <h3>Database</h3>
            <strong style={{ fontSize: 22 }}>Neo4j</strong>
          </div>
        </div>

        <section className="panel">
          <h2>Patient Records</h2>

          <input
            className="search"
            placeholder="Search by name, patient ID or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p>Loading patients...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="patient-list">
            {filteredPatients.map((patient) => (
              <button
                className="patient-card"
                key={patient.patientId}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="avatar">
                  {patient.name?.[0] || "P"}
                </div>

                <div>
                  <h3>{patient.name}</h3>
                  <p>
                    ID: {patient.patientId} | Age: {patient.age}
                    {" | "}City: {patient.city}
                  </p>
                </div>

                <span>View Profile →</span>
              </button>
            ))}
          </div>

          {!loading && !error && filteredPatients.length === 0 && (
            <p>No matching patients found.</p>
          )}
        </section>

        {selectedPatient && (
          <section className="panel profile">
            <button
              className="close"
              onClick={() => setSelectedPatient(null)}
            >
              ✕
            </button>

            <h2>Patient Profile</h2>
            <h3>{selectedPatient.name}</h3>
            <p><b>Patient ID:</b> {selectedPatient.patientId}</p>
            <p><b>Age:</b> {selectedPatient.age}</p>
            <p><b>City:</b> {selectedPatient.city}</p>

            <button className="twin-button" disabled>
              Digital Twin Visualization — Coming Next
            </button>
          </section>
        )}

        <footer>
          Patient Digital Twin | Neo4j + FastAPI + React
        </footer>
      </main>
    </div>
  );
}

export default App;
