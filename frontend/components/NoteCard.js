export default function NoteCard({ note, onDelete }) {
  return (
    <li className="flex justify-between border p-2 rounded">
      <div>
        <strong>{note.title}</strong>: {note.content}
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </li>
  );
}
