// Description: Displays details of a single note with options to edit it.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function NoteDetails({ params }) {
  const id = window.location.pathname.split('/').pop();
  const [note, setNote] = useState(null);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: token }
      });
      setNote(res.data);
      setContent(res.data.content);
    };
    fetchNote();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/notes/${id}`, { content }, {
      headers: { Authorization: token }
    });
    setNote(prev => ({ ...prev, content }));
    setEdit(false);
  };

  if (!note) return <p>Loading...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="font-bold text-xl">{note.title}</h2>
      {edit ? (
        <>
          <textarea
            className="w-full p-2 border rounded mt-2"
            rows="6"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-2 rounded mt-2" onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <div className="mt-2">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
          <button className="bg-blue-600 text-white p-2 rounded mt-2" onClick={() => setEdit(true)}>Edit</button>
        </>
      )}
    </div>
  );
}

export default NoteDetails;
