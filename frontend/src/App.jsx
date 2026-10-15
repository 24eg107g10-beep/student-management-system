
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

  // Get all students from the backend
  async function loadStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Server returned " + response.status);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data && Array.isArray(data.content)) {
        setStudents(data.content);
      } else {
        setStudents([]);
      }

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

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  // Add a new student or update an existing student
  async function handleSubmit(event) {
    event.preventDefault();

    const isEditing = editingId !== null;
    const url = isEditing
      ? API_URL + "/" + editingId
      : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Could not save student");
      }

      setForm({
        name: "",
        email: "",
        course: "",
      });

      setEditingId(null);
      await loadStudents();
      setMessage(
        isEditing
          ? "Student updated successfully."
          : "Student added successfully."
      );
    } catch (error) {
      setMessage(
        "Could not save student. Check the backend API and request fields."
      );
    }
  }

  // Fill the form for editing
  function editStudent(student) {
    const id = student.id ?? student.studentId;

    if (id === undefined || id === null) {
      setMessage("Student ID was not found.");
      return;
    }

    setForm({
      name: student.name ?? "",
      email: student.email ?? "",
      course: student.course ?? "",
    });

    setEditingId(id);
    setMessage("Editing student record.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete a student
  async function deleteStudent(student) {
    const id = student.id ?? student.studentId;

    if (id === undefined || id === null) {
      setMessage("Student ID was not found.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(API_URL + "/" + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete student");
      }

      await loadStudents();
      setMessage("Student deleted successfully.");
    } catch (error) {
      setMessage(
        "Could not delete student. Check the backend API."
      );
    }
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      course: "",
    });
    setMessage("");
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Student Management System</h1>
          <p>Manage your student records in one place.</p>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div className="stat-card">
          <span>Application</span>
          <strong className="status">Student Portal</strong>
        </div>
      </section>

      <section className="panel">
        <h2>{editingId !== null ? "Edit Student" : "Add New Student"}</h2>

        <form onSubmit={handleSubmit} className="student-form">
          <input
            type="text"
            name="name"
            placeholder="Student name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId !== null ? "Update Student" : "Add Student"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <div className="table-heading">
          <h2>Student Records</h2>
          <button
            type="button"
            className="secondary"
            onClick={loadStudents}
          >
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
                <tr
                  key={
                    student.id ??
                    student.studentId ??
                    index
                  }
                >
                  <td>
                    {student.id ??
                      student.studentId ??
                      "-"}
                  </td>

                  <td>{student.name ?? "-"}</td>
                  <td>{student.email ?? "-"}</td>
                  <td>{student.course ?? "-"}</td>

                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="edit"
                        onClick={() => editStudent(student)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() => deleteStudent(student)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {students.length === 0 && !message && (
                <tr>
                  <td colSpan="5">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        Student Management System | React + Spring Boot + MySQL
      </footer>
    </main>
  );
}

export default App;
