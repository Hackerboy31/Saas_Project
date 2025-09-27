"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const router = useRouter();

  // get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("https://saas-project-backe.onrender.com/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://saas-project-backe.onrender.com/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.canUpgrade) {
          // Show popup and redirect to /pro on OK
          if (
            window.confirm(
              "You have reached the FREE plan limit (3 notes). Upgrade to Pro?"
            )
          ) {
            router.push("/pro"); // Redirect to Pro page
          }
        } else {
          alert(errorData.error || "Failed to add note");
        }
        return;
      }

      // Refresh notes after adding
      fetchNotes();
      setTitle("");
      setBody("");
    } catch (err) {
      console.error("Failed to create note", err);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      // Update Note
      await fetch(
        `https://saas-project-backe.onrender.com/notes/${editingNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingNote.title,
            body: editingNote.body,
          }),
        }
      );

      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error("Failed to update note", err);
    }
  };

  const deleteNote = async (id) => {
    // Delete Note
    await fetch(`https://saas-project-backe.onrender.com/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchNotes();
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <button
          onClick={logout}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Note */}
      <form onSubmit={createNote} className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mr-2"
          required
        />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          className="border p-2 mr-2"
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* Edit Note */}
      {editingNote && (
        <form onSubmit={updateNote} className="mb-4">
          <input
            value={editingNote.title || ""}
            onChange={(e) =>
              setEditingNote({ ...editingNote, title: e.target.value })
            }
            placeholder="Title"
            className="border p-2 mr-2"
            required
          />
          <input
            value={editingNote.body || ""}
            onChange={(e) =>
              setEditingNote({ ...editingNote, body: e.target.value })
            }
            placeholder="Body"
            className="border p-2 mr-2"
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Update
          </button>
          <button
            type="button"
            onClick={() => setEditingNote(null)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Notes List */}
      <ul>
        {notes.map((n) => (
          <li key={n.id} className="flex justify-between border p-2 mb-2">
            <div>
              <strong>{n.title}</strong>: {n.body}
            </div>
            <div>
              <button
                onClick={() => setEditingNote(n)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(n.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
