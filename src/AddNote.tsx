import React, { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        margin: 'auto',
    },
};

Modal.setAppElement('#root');

interface AddNoteProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (note: string) => void;
}

export const AddNote: React.FC<AddNoteProps> = ({ isOpen, onRequestClose, onSubmit }) => {
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(note);
        setNote('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Add Note"
        >
            <h2>Add Note</h2>
            <form onSubmit={handleSubmit} className="p-3">
                <textarea
                    className="m-auto"
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                    placeholder="Enter your note"
                    style={{ width: '100%', height: '200px', padding: '10px', boxSizing: 'border-box' }}
                />
                <div className="flex font-monospace">
                    <button type="submit" className="btn btn-dark m-2">Save</button>
                    <button type="button" className="btn btn-dark m-2" onClick={onRequestClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}