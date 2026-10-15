```jsx
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://student-management-api-2026.onrender.com/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("Loading students...");

  async function loadStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : data.content ?? []);
      setMessage("");
    } catch (error) {
      setMessage(
        "Could not load students. Check that the backend is running and the API URL is correct."
      );
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Could not save student");
      }

      setForm({ name: "", email: "", course: "" });
      setEditingId(null);
      setMessage("Student saved successfully.");
      await loadStudents();
    } catch (error) {
      setMessage(
        "Could not save student. Check your backend API endpoints."
      );
    }
  }

  function editStudent(student) {
    setForm({
      name: student.name ?? "",
      email: student.email ?? "",
      course: student.course ?? "",
    });
    setEditingId(student.id);
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setMessage("Student deleted successfully.");
      await loadStudents();
    } catch (error) {
      setMessage("Could not delete student. Check your backend API.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Student Management System</h1>
          <p>Manage student records in one place.</p>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
        <div className="stat-card">
          <span>System Status</span>
          <strong className="status">Connected / Checking</strong>
        </div>
      </section>

      <section className="panel">
        <h2>{editingId ? "Edit Student" : "Add New Student"}</h2>

        <form onSubmit={handleSubmit} className="student-form">
          <input
            name="name"
            placeholder="Student name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Student" : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", course: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <div className="table-heading">
          <h2>Student Records</h2>
          <button className="secondary" onClick={loadStudents}>
            Refresh
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id ?? index}>
                  <td>{student.id ?? student.studentId ?? "-"}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="edit"
                        onClick={() => editStudent(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() =>
                          deleteStudent(student.id ?? student.studentId)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && !message && (
                <tr>
                  <td colSpan="5">No student records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>Student Management System · React + Spring Boot</footer>
    </main>
  );
}

export default App;
```
