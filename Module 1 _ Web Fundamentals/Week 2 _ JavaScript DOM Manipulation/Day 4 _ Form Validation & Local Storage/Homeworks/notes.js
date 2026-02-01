// 1. State & DOM Elements
let notes = [];
let isEditing = false;
let editingId = null;

const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const titleCount = document.getElementById('title-count');
const contentCount = document.getElementById('content-count');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const colorOptionsContainer = document.getElementById('color-options');
const selectedColorInput = document.getElementById('selected-color');

const colors = ['#ffffff', '#ffefc1', '#e2f0cb', '#ffc2c2', '#c1e1ff', '#e0c1ff'];

// 2. Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    initColorPicker();
});

// 3. LocalStorage Functions
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const stored = localStorage.getItem('notes');
    if (stored) {
        try {
            notes = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse notes:', e);
            notes = [];
        }
    }
    displayNotes();
}

// 4. Helper Functions
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function initColorPicker() {
    colors.forEach(color => {
        const btn = document.createElement('div');
        btn.className = 'color-btn';
        btn.style.backgroundColor = color;
        if (color === '#ffffff') btn.classList.add('selected');
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColorInput.value = color;
        });
        
        colorOptionsContainer.appendChild(btn);
    });
}

// 5. Core Features
function addNote(title, content, color) {
    const note = {
        id: Date.now(),
        title,
        content,
        timestamp: new Date().toISOString(),
        color
    };
    notes.unshift(note); // Add to beginning
    saveNotes();
    displayNotes();
}

function updateNote(id, title, content, color) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex > -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            title,
            content,
            color,
            timestamp: new Date().toISOString() // Update timestamp on edit
        };
        saveNotes();
        displayNotes();
        resetForm();
    }
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        displayNotes();
        
        // If deleting the note currently being edited, reset form
        if (isEditing && editingId === id) {
            resetForm();
        }
    }
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    // Populate form
    titleInput.value = note.title;
    contentInput.value = note.content;
    selectedColorInput.value = note.color;
    
    // Update color picker UI
    document.querySelectorAll('.color-btn').forEach(btn => {
        // Convert rgb to hex if needed or just compare styles roughly
        // Simple check for hex match
        if (btn.style.backgroundColor === 'rgb(255, 255, 255)' && note.color === '#ffffff') {
             btn.classList.add('selected');
        } else {
             // Reset selection logic for simplicity or match exact color
             btn.classList.toggle('selected', rgbToHex(btn.style.backgroundColor) === note.color || btn.style.backgroundColor === note.color);
        }
    });

    // Set Edit Mode
    isEditing = true;
    editingId = id;
    submitBtn.textContent = 'Update Note';
    formTitle.textContent = 'Edit Note';
    cancelBtn.style.display = 'inline-block';
    
    // Trigger input events to update char counters
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    noteForm.reset();
    isEditing = false;
    editingId = null;
    submitBtn.textContent = 'Add Note';
    formTitle.textContent = 'Add New Note';
    cancelBtn.style.display = 'none';
    selectedColorInput.value = '#ffffff';
    
    // Reset counters
    titleCount.textContent = '0/50';
    contentCount.textContent = '0/500';
    
    // Reset color picker
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    colorOptionsContainer.firstElementChild.classList.add('selected');
}

// 6. Display Logic
function displayNotes(notesToShow = notes) {
    notesContainer.innerHTML = '';
    
    if (notesToShow.length === 0) {
        notesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No notes found.</p>';
        return;
    }

    notesToShow.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.style.backgroundColor = note.color;
        
        card.innerHTML = `
            <h3>${note.title}</h3>
            <p class="note-content">${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}</p>
            <small class="timestamp">${formatDate(note.timestamp)}</small>
            <div class="note-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        // Event Listeners for buttons
        card.querySelector('.edit-btn').addEventListener('click', () => editNote(note.id));
        card.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
        
        notesContainer.appendChild(card);
    });
}

// 7. Event Listeners
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const color = selectedColorInput.value;

    if (title && content) {
        if (isEditing) {
            updateNote(editingId, title, content, color);
        } else {
            addNote(title, content, color);
            resetForm();
        }
    }
});

cancelBtn.addEventListener('click', resetForm);

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
    );
    displayNotes(filtered);
});

// Character Counters
[titleInput, contentInput].forEach(input => {
    input.addEventListener('input', function() {
        const maxLength = this.getAttribute('maxlength');
        const currentLength = this.value.length;
        const counterId = this.id === 'note-title' ? 'title-count' : 'content-count';
        document.getElementById(counterId).textContent = `${currentLength}/${maxLength}`;
    });
});

// Helper for color picker logic (browser returns rgb)
function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '#ffffff';
    if (rgb.startsWith('#')) return rgb;
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return '#ffffff';
    return "#" + ((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1);
}