import axios from 'axios';
import { useEffect, useState } from "react";
import { AddNote } from "./AddNote";

interface Note {
    id: string;
    text: string;
}

function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/notes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the notes!', error);
            });
    }, []);

    const addNote = (noteText: string) => {
        axios.post('http://localhost:5000/notes', { text: noteText })
            .then(response => {
                const newNote = { text: noteText, id: response.data.id }; // Use the ID from the server response
                setNotes(prevNotes => [...prevNotes, newNote]);
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('There was an error adding the note!', error);
            });
    };

    const handleDelete = (noteId: string) => {
        axios.delete(`http://localhost:5000/notes/${noteId}`)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
            })
            .catch(error => {
                console.error('There was an error deleting the note!', error);
            });
    };

    return (
        <>
            <nav className="navbar p-3">
                <h2 className="font-monospace">Note Redis App</h2>
                <button onClick={() => setIsModalOpen(true)} type="button"
                        className="btn btn-dark font-monospace">
                    <i className="bi bi-plus me-2"></i>Add Note
                </button>
            </nav>
            <div>
                <div className="row m-3">
                    {notes.map(note => (
                        <div className="col-md-3 mb-4" key={note.id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">{note.text}</p>
                                    <button
                                        className="btn btn-dark"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <AddNote
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onSubmit={addNote}
                />
            </div>
        </>
    );
}

export default App;
