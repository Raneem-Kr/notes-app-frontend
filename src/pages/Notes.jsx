import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://notes-app-backend-6vkp.onrender.com//api/notes",
        {
          headers: {
            authorization: token,
          },
        },
      );

      setNotes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createNote = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://notes-app-backend-6vkp.onrender.com/api/notes",
        {
          title,
          content,
        },
        {
          headers: {
            authorization: token,
          },
        },
      );

      toast.success("Note created");

      setTitle("");
      setContent("");

      getNotes();
    } catch (error) {
      console.log(error);

      toast.error("Failed to create note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://notes-app-backend-6vkp.onrender.com/api/notes/${id}`,
        {
          headers: {
            authorization: token,
          },
        },
      );

      toast.success("Note deleted");

      getNotes();
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to delete");
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const updateNote = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://notes-app-backend-6vkp.onrender.com/api/notes/${editingId}`,
        {
          title,
          content,
        },
        {
          headers: {
            authorization: token,
          },
        },
      );

      toast.success("Note updated");

      setEditingId(null);
      setTitle("");
      setContent("");
      setIsModalOpen(false);

      getNotes();
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to update");
    }
  };

  const filteredNotes = notes.filter((note) => {
    return (
      (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div
      className={`min-h-screen px-6 py-8 transition ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-black"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Notes</h1>

            <p className="text-slate-400">Your saved notes will appear here.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-semibold transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div
          className={`border rounded-2xl p-6 mb-8 shadow-2xl ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-300"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">
            {editingId ? "Edit Note" : "Create Note"}
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-100 border-slate-300"
              }`}
            />

            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none h-32 ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-100 border-slate-300"
              }`}
            />

            <button
              onClick={createNote}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
            >
             Create Note
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full mb-6 px-4 py-3 rounded-xl border outline-none ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-300"
          }`}
        />

        <div className="grid md:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`border rounded-2xl p-5 shadow-xl ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-300"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>

              <p className="text-slate-400">{note.content}</p>

              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => startEdit(note)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Note</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-100 border-slate-300"
                }`}
              />

              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none h-32 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-100 border-slate-300"
                }`}
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setTitle("");
                    setContent("");
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-600 hover:bg-slate-700 font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  onClick={updateNote}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
