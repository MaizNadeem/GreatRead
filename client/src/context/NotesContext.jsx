import React, { createContext, useContext, useEffect, useState } from 'react';

const NotesContext = createContext();

export function useNotes() {
    return useContext(NotesContext);
}

export function NotesProvider({ children }) {

    const [selectedButton, setSelectedButton] = useState(null);
    const [previewOptions, setPreviewOptions] = useState({
        notes: true,
        links: true,
        label: true,
    })
    const [notesCategories, setNotesCategories] = useState([]);
    const [notesBooks, setNotesBooks] = useState([]);

    function addBook(newBook) {
        const updatedBooks = [];
        updatedBooks.push(newBook);
        setNotesBooks(updatedBooks);
    }
    

    return (
        <NotesContext.Provider value={{
            selectedButton,
            setSelectedButton,
            previewOptions,
            setPreviewOptions,
            notesCategories,
            setNotesCategories,
            notesBooks,
            setNotesBooks,
            addBook,
        }}>
            {children}
        </NotesContext.Provider>
    );
}
