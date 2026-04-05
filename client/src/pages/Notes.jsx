import { useState, useEffect } from 'react';
import api, { getUserId } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Notes() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const userId = getUserId();

  const fetchFolders = async () => {
    try {
      const res = await api.get(`/folder/user/${userId}`);
      setFolders(res.data);
    } catch {
      navigate('/login');
    }
  };

  const fetchNotes = async (folderId) => {
    const res = await api.get('/note');
    setNotes(res.data.filter(n => n.folderId === folderId));
  };

  const createFolder = async () => {
    if (!newFolderName) return;
    await api.post('/folder', { name: newFolderName, appUserId: userId });
    setNewFolderName('');
    setShowFolderModal(false);
    fetchFolders();
  };

  const deleteFolder = async (id) => {
    await api.delete(`/folder/${id}`);
    setSelectedFolder(null);
    setNotes([]);
    fetchFolders();
  };

  const createNote = async () => {
    if (!newNote.title) return;
    await api.post('/note', { title: newNote.title, content: newNote.content, userId, folderId: selectedFolder });
    setNewNote({ title: '', content: '' });
    setShowNoteModal(false);
    fetchNotes(selectedFolder);
  };

  const updateNote = async () => {
    if (!editNote.title) return;
    await api.put(`/note/${editNote.id}`, { title: editNote.title, content: editNote.content });
    setShowEditModal(false);
    setEditNote(null);
    fetchNotes(selectedFolder);
  };

  const deleteNote = async (id) => {
    await api.delete(`/note/${id}`);
    fetchNotes(selectedFolder);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => { fetchFolders(); }, []);
  useEffect(() => { if (selectedFolder) fetchNotes(selectedFolder); }, [selectedFolder]);

  // FOLDER PAGE
  if (!selectedFolder) {
    const allFolders = [...folders, null]; // null = + button
    const pairs = [];
    for (let i = 0; i < allFolders.length; i += 2) {
      pairs.push([allFolders[i], allFolders[i + 1]]);
    }

    return (
      <div style={styles.folderPage}>
        {/* Header */}
        <div style={styles.folderPageHeader}>
          <span style={styles.logo}>📝 NoteApp</span>
          <button style={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>

        {/* Folder Grid */}
        <div style={styles.folderGrid}>
          {folders.length === 0 ? (
            <div style={styles.folderRow}>
              <div style={styles.addFolderCard} onClick={() => setShowFolderModal(true)}>
                <span style={styles.addIcon}>+</span>
                <span style={styles.addLabel}>New Folder</span>
              </div>
            </div>
          ) : (
            pairs.map((pair, i) => (
              <div key={i} style={styles.folderRow}>
                {pair[0] && (
                  <div style={styles.folderCard} onClick={() => setSelectedFolder(pair[0].id)}>
                    <div style={styles.folderCardTop}>
                      <span style={styles.folderIcon}>📁</span>
                      <button style={styles.folderDeleteBtn} onClick={e => { e.stopPropagation(); deleteFolder(pair[0].id); }}>✕</button>
                    </div>
                    <span style={styles.folderName}>{pair[0].name}</span>
                  </div>
                )}
                {pair[1] ? (
                  <div style={styles.folderCard} onClick={() => setSelectedFolder(pair[1].id)}>
                    <div style={styles.folderCardTop}>
                      <span style={styles.folderIcon}>📁</span>
                      <button style={styles.folderDeleteBtn} onClick={e => { e.stopPropagation(); deleteFolder(pair[1].id); }}>✕</button>
                    </div>
                    <span style={styles.folderName}>{pair[1].name}</span>
                  </div>
                ) : (
                  <div style={styles.addFolderCard} onClick={() => setShowFolderModal(true)}>
                    <span style={styles.addIcon}>+</span>
                    <span style={styles.addLabel}>New Folder</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Folder Modal */}
        {showFolderModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>New Folder</h3>
              <input style={styles.modalInput} placeholder="Folder name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
              <div style={styles.modalActions}>
                <button style={styles.cancelBtn} onClick={() => setShowFolderModal(false)}>Cancel</button>
                <button style={styles.confirmBtn} onClick={createFolder}>Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // NOTES PAGE
  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.logo}>📝 NoteApp</span>
          <button style={styles.logoutBtn} onClick={logout}>↩</button>
        </div>
        <div style={styles.foldersHeader}>
          <span style={styles.sectionLabel}>FOLDERS</span>
          <button style={styles.addBtn} onClick={() => setShowFolderModal(true)}>+</button>
        </div>
        <div style={styles.folderList}>
          <div style={styles.backBtn} onClick={() => setSelectedFolder(null)}>← Back</div>
          {folders.map(folder => (
            <div
              key={folder.id}
              style={{ ...styles.folderItem, ...(selectedFolder === folder.id ? styles.folderActive : {}) }}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <span>📁 {folder.name}</span>
              <button style={styles.deleteFolderBtn} onClick={e => { e.stopPropagation(); deleteFolder(folder.id); }}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.mainHeader}>
          <h2 style={styles.folderTitle}>{folders.find(f => f.id === selectedFolder)?.name}</h2>
          <button style={styles.newNoteBtn} onClick={() => setShowNoteModal(true)}>+ New Note</button>
        </div>
        <div style={styles.noteGrid}>
          {notes.length === 0 && <p style={styles.empty}>No notes yet. Create one!</p>}
          {notes.map(note => (
            <div key={note.id} style={styles.noteCard}>
              <div style={styles.noteCardHeader}>
                <span style={styles.noteTitle}>{note.title}</span>
                <div style={styles.noteActions}>
                  <button style={styles.editNoteBtn} onClick={() => { setEditNote(note); setShowEditModal(true); }}>✏️</button>
                  <button style={styles.deleteNoteBtn} onClick={() => deleteNote(note.id)}>✕</button>
                </div>
              </div>
              <p style={styles.noteContent}>{note.content}</p>
              <span style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>New Folder</h3>
            <input style={styles.modalInput} placeholder="Folder name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowFolderModal(false)}>Cancel</button>
              <button style={styles.confirmBtn} onClick={createFolder}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {showNoteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>New Note</h3>
            <input style={styles.modalInput} placeholder="Title" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
            <textarea style={styles.modalTextarea} placeholder="Content" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button style={styles.confirmBtn} onClick={createNote}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {showEditModal && editNote && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Edit Note</h3>
            <input style={styles.modalInput} value={editNote.title} onChange={e => setEditNote({ ...editNote, title: e.target.value })} />
            <textarea style={styles.modalTextarea} value={editNote.content} onChange={e => setEditNote({ ...editNote, content: e.target.value })} />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => { setShowEditModal(false); setEditNote(null); }}>Cancel</button>
              <button style={styles.confirmBtn} onClick={updateNote}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  // Folder Page
  folderPage: { minHeight: '100vh', background: '#000', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  folderPageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #21262d' },
  folderGrid: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 2rem' },
  folderRow: { display: 'flex', gap: '1.5rem' },
  folderCard: { width: '160px', height: '160px', background: '#0d1117', border: '1px solid #21262d', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s' },
  folderCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  folderIcon: { fontSize: '2rem' },
  folderDeleteBtn: { background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: '0.8rem' },
  folderName: { fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3' },
  addFolderCard: { width: '160px', height: '160px', background: '#0d1117', border: '2px dashed #30363d', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' },
  addIcon: { fontSize: '2rem', color: '#8b949e' },
  addLabel: { fontSize: '0.85rem', color: '#8b949e' },

  // Notes Page
  app: { display: 'flex', height: '100vh', background: '#000', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  sidebar: { width: '240px', background: '#0d1117', borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #21262d' },
  logo: { fontWeight: 700, fontSize: '1rem' },
  logoutBtn: { background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '0.9rem' },
  foldersHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' },
  sectionLabel: { fontSize: '0.7rem', color: '#8b949e', fontWeight: 600, letterSpacing: '0.05em' },
  addBtn: { background: 'none', border: '1px solid #30363d', color: '#e6edf3', borderRadius: '4px', cursor: 'pointer', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' },
  folderList: { flex: 1, overflowY: 'auto' },
  backBtn: { padding: '0.6rem 1rem', color: '#58a6ff', cursor: 'pointer', fontSize: '0.85rem' },
  folderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', cursor: 'pointer', borderRadius: '6px', margin: '0 0.5rem', color: '#8b949e', fontSize: '0.9rem' },
  folderActive: { background: '#21262d', color: '#e6edf3' },
  deleteFolderBtn: { background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #21262d' },
  folderTitle: { margin: 0, fontSize: '1.2rem', fontWeight: 600 },
  newNoteBtn: { padding: '0.5rem 1rem', background: '#238636', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
  noteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', padding: '1.5rem 2rem', overflowY: 'auto' },
  noteCard: { background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  noteCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  noteTitle: { fontWeight: 600, fontSize: '0.95rem' },
  noteActions: { display: 'flex', gap: '0.25rem' },
  editNoteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' },
  deleteNoteBtn: { background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: '0.8rem' },
  noteContent: { color: '#8b949e', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 },
  noteDate: { color: '#6e7681', fontSize: '0.75rem' },
  empty: { color: '#8b949e' },

  // Modals
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '1.5rem', width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  modalTitle: { margin: 0, color: '#e6edf3' },
  modalInput: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #30363d', background: '#010409', color: '#e6edf3', fontSize: '1rem' },
  modalTextarea: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #30363d', background: '#010409', color: '#e6edf3', fontSize: '0.95rem', minHeight: '100px', resize: 'vertical' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' },
  cancelBtn: { padding: '0.5rem 1rem', background: 'none', border: '1px solid #30363d', color: '#e6edf3', borderRadius: '6px', cursor: 'pointer' },
  confirmBtn: { padding: '0.5rem 1rem', background: '#238636', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
};
