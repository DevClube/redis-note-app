import axios from 'axios';
import { useEffect, useState } from "react";
import { AddNote } from "./AddNote"; // Removed the .tsx extension

interface Note {
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

    const addNote = (noteText: string) => { // Corrected the type of noteText
        axios.post('http://localhost:5000/notes', { text: noteText })
            .then(() => {
                setNotes([...notes, { text: noteText }]);
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('There was an error adding the note!', error);
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
                    {notes.map((note, index) => (
                        <div className="col-md-3 mb-4" key={index}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">{note.text}</p>
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