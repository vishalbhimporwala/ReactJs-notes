import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "./Dashboard.css";

interface Note {
  _id: string;
  title: string;
  description: string;
}

const baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const hasFetched = useRef(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user?.accessToken || hasFetched.current) return;

    hasFetched.current = true; // 👈 Move it here first!

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/note/fetch`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        if (response.data.success) {
          setNotes(response.data.data);
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          const shouldLogout = window.confirm(
            "Unauthorized! Click OK to logout."
          );
          if (shouldLogout) {
            logout();
          }
        } else {
          setError("Failed to fetch notes");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleAddNote = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    setAdding(true);
    try {
      const response = await axios.post(
        `${baseURL}/note/create`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setNotes((prev) => [...prev, response.data.data]);
        setTitle("");
        setDescription("");
      }
      setAdding(false);
    } catch (err) {
      console.error("Failed to add note", err);
      alert("Failed to add note");
      setAdding(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseURL}/note/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      if (response.data.success) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
      } else {
        alert("Failed to delete the note.");
      }
    } catch (err) {
      console.error("Error deleting note", err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3>Welcome, {user?.firstName} 👋</h3>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="add-note-form">
        <p>Add New Note</p>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button disabled={adding} onClick={handleAddNote}>
          {adding ? "Adding Notes" : "Add Note"}
        </button>
      </div>

      <p>Your Notes</p>

      {loading && <p>Loading notes...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="notes-list">
        {!loading && notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          notes
            .slice()
            .reverse()
            .map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <h4>{note.title}</h4>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    x Delete
                  </button>
                </div>
                <p>{note.description}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
