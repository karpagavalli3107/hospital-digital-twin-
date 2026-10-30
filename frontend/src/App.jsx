
import { useEffect, useState } from "react";
import "./App.css";
//const API_URL = "http://127.0.0.1:8001";
const API_URL = "https://hospital-digital-twin-api.onrender.com";

function App() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [digitalTwin, setDigitalTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twinLoading, setTwinLoading] = useState(false);
  const [error, setError] = useState("");
  const [twinError, setTwinError] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch(`${API_URL}/patients`);

        if (!response.ok) {
          throw new Error("Unable to load patient records");
        }

        const data = await response.json();
        setPatients(data.patients || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  async function openDigitalTwin(patient) {
    setSelectedPatient(patient);
    setDigitalTwin(null);
    setTwinError("");
    setTwinLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/patients/${patient.patientId}/digital-twin`
      );

      if (!response.ok) {
        throw new Error("Unable to load Digital Twin");
      }

      const data = await response.json();
      setDigitalTwin(data);
    } catch (err) {
      setTwinError(err.message);
    } finally {
      setTwinLoading(false);
    }
  }

  function closeDigitalTwin() {
    setSelectedPatient(null);
    setDigitalTwin(null);
    setTwinError("");
  }

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.patientId} ${patient.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const twin = digitalTwin?.digitalTwin;
  const vitals = digitalTwin?.vitalSigns?.[0];

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
          <p>Connected fictional patient records from Neo4j</p>
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
                onClick={() => openDigitalTwin(patient)}
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

                <span>View Digital Twin →</span>
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
              onClick={closeDigitalTwin}
              aria-label="Close Digital Twin"
            >
              ✕
            </button>

            <h2>🧬 Patient Digital Twin</h2>

            <h3>{selectedPatient.name}</h3>
            <p>
              <b>Patient ID:</b> {selectedPatient.patientId}
              {" | "}
              <b>Age:</b> {selectedPatient.age}
              {" | "}
              <b>City:</b> {selectedPatient.city}
            </p>

            {twinLoading && <p>Loading Digital Twin...</p>}

            {twinError && (
              <p style={{ color: "red" }}>{twinError}</p>
            )}

            {digitalTwin && (
              <div className="twin-details">
                <h3>Digital Twin Health Overview</h3>

                <div className="stats">
                  <div className="stat-card">
                    <h3>Health Score</h3>
                    <strong>{twin?.healthScore ?? "N/A"}</strong>
                  </div>

                  <div className="stat-card">
                    <h3>Risk Level</h3>
                    <strong style={{ fontSize: 22 }}>
                      {twin?.riskLevel ?? "N/A"}
                    </strong>
                  </div>

                  <div className="stat-card">
                    <h3>Health Status</h3>
                    <strong style={{ fontSize: 20 }}>
                      {twin?.status ?? "N/A"}
                    </strong>
                  </div>
                </div>

                <h3>❤️ Vital Signs</h3>
                {vitals ? (
                  <div className="twin-grid">
                    <div className="twin-info-card">
                      <h4>Blood Pressure</h4>
                      <p>
                        {vitals.systolicBP}/{vitals.diastolicBP} mmHg
                      </p>
                    </div>

                    <div className="twin-info-card">
                      <h4>Heart Rate</h4>
                      <p>{vitals.heartRate} bpm</p>
                    </div>

                    <div className="twin-info-card">
                      <h4>Temperature</h4>
                      <p>{vitals.temperature} °C</p>
                    </div>
                  </div>
                ) : (
                  <p>No vital signs available.</p>
                )}

                <h3>📋 Medical History</h3>
                {digitalTwin.medicalHistory?.length ? (
                  digitalTwin.medicalHistory.map((item, index) => (
                    <div className="twin-info-card" key={index}>
                      <p>{item.condition}</p>
                    </div>
                  ))
                ) : (
                  <p>No medical history available.</p>
                )}

                <h3>🧪 Lab Reports</h3>
                {digitalTwin.labReports?.length ? (
                  digitalTwin.labReports.map((report, index) => (
                    <div className="twin-info-card" key={index}>
                      <h4>{report.testName}</h4>
                      <p>Result: {report.result}</p>
                      <p>Report ID: {report.reportId}</p>
                    </div>
                  ))
                ) : (
                  <p>No lab reports available.</p>
                )}

                <h3>💊 Prescriptions & Medicines</h3>
                {digitalTwin.prescriptions?.length ? (
                  digitalTwin.prescriptions.map((item, index) => (
                    <div className="twin-info-card" key={index}>
                      <h4>
                        {item.medicine?.name ?? "Medicine unavailable"}
                      </h4>
                      <p>
                        Type: {item.medicine?.type ?? "N/A"}
                      </p>
                      <p>
                        Company: {item.medicine?.company ?? "N/A"}
                      </p>
                      <p>
                        Prescription Date:{" "}
                        {item.prescription?.date ?? "N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No prescriptions available.</p>
                )}

                <h3>🩺 Appointments & Doctors</h3>
                {digitalTwin.appointments?.length ? (
                  digitalTwin.appointments.map((item, index) => (
                    <div className="twin-info-card" key={index}>
                      <h4>
                        {item.doctor?.name ?? "Doctor unavailable"}
                      </h4>
                      <p>
                        Specialization:{" "}
                        {item.doctor?.specialization ?? "N/A"}
                      </p>
                      <p>
                        Appointment Date:{" "}
                        {item.appointment?.date ?? "N/A"}
                      </p>
                      <p>
                        Status:{" "}
                        {item.appointment?.status ?? "N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No appointments available.</p>
                )}

                <p className="demo-note">
                  Demo only: fictional patient data. Health scores
                  and risk levels are retrieved from Neo4j, not
                  calculated as medical advice.
                </p>
              </div>
            )}
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
