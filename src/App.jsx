import { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaPlus, FaRegTrashAlt, FaTimes } from 'react-icons/fa';

const App = () => {
  const initNotes = JSON.parse(localStorage.getItem('notes') || '[]');
  const [notes, setNotes] = useState(initNotes);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  function handleEditMode() {
    if (selectedNote) setSelectedNote(null);
    setIsEditMode(!isEditMode);
  }

  function handleAddNote(note) {
    if (selectedNote && note.id === selectedNote.id) {
      setNotes(notes => [note, ...notes.filter(note => note.id !== selectedNote.id)]);
    } else {
      setNotes(notes => [...notes, note]);
    }
  }

  function handleDeleteNote() {
    setNotes(notes => notes.filter(note => note.id !== selectedNote.id));
    setIsEditMode(!isEditMode);
  }

  function handleSelection(note) {
    setSelectedNote(note);
    setIsEditMode(!isEditMode);
  }

  localStorage.setItem('notes', JSON.stringify(notes));

  return (
    <div className='app'>
      {isEditMode ? (
        <FormPage onEditMode={handleEditMode} selectedNote={selectedNote} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
      ) : (
        <MainPage notes={notes} onSelection={handleSelection} />
      )}
      <Footer isEditMode={isEditMode} onEditMode={handleEditMode} />
    </div>
  );
};
export default App;

const MainPage = ({ notes, onSelection }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState(notes);

  function handleSearch() {
    setFilteredNotes(notes.filter(note => note.title.toLowerCase().match(searchValue.toLocaleLowerCase())));
  }

  useEffect(handleSearch, [searchValue, notes]);

  return (
    <>
      <header>
        {searchMode ? <input className='search-input' value={searchValue} onChange={e => setSearchValue(e.target.value)} type='text' placeholder='Keyword...' /> : <h1>My Notes</h1>}
        <Button onCLick={() => setSearchMode(prevState => !prevState)}>{searchMode ? <FaTimes /> : <FaSearch />}</Button>
      </header>
      <main>
        {filteredNotes.length > 0 ? (
          <ul className='notes'>
            {filteredNotes.map(note => (
              <Note key={note.id} note={note} onSelection={onSelection} />
            ))}
          </ul>
        ) : (
          <p className='empty-message'>No notes found.</p>
        )}
      </main>
    </>
  );
};

const Note = ({ note, onSelection }) => {
  return (
    <li className='note' onClick={() => onSelection(note)}>
      <h3>{note.title}</h3>
      <p>{note.text}</p>
      <time>{note.date}</time>
    </li>
  );
};

const FormPage = ({ onEditMode, onAddNote, onDeleteNote, selectedNote }) => {
  const [title, setTitle] = useState(selectedNote ? selectedNote.title : '');
  const [text, setText] = useState(selectedNote ? selectedNote.text : '');

  const newNote = { id: selectedNote ? selectedNote.id : crypto.randomUUID(), title, text, date: '12/03/2023' };

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !text) return;
    onAddNote(newNote);
    onEditMode();
  }

  return (
    <>
      <header>
        <Button onCLick={onEditMode}>
          <FaChevronLeft />
        </Button>
        <Button bgColor='main-color' type='sumbit' form='form'>
          save
        </Button>
        {selectedNote && (
          <Button onCLick={onDeleteNote}>
            <FaRegTrashAlt />
          </Button>
        )}
      </header>
      <main className='main-form'>
        <form id='form' onSubmit={handleSubmit}>
          <input onChange={e => setTitle(e.target.value)} value={title} type='text' placeholder='Title' />
          <textarea onChange={e => setText(e.target.value)} value={text} rows='16' placeholder='Note details...'></textarea>
        </form>
      </main>
    </>
  );
};

const Footer = ({ isEditMode, onEditMode }) => {
  return (
    <footer>
      {isEditMode || (
        <Button onCLick={onEditMode}>
          <FaPlus />
        </Button>
      )}
    </footer>
  );
};

const Button = ({ children, onCLick, bgColor, type, form }) => {
  return (
    <button className={bgColor} onClick={onCLick} type={type} form={form}>
      {children}
    </button>
  );
};
