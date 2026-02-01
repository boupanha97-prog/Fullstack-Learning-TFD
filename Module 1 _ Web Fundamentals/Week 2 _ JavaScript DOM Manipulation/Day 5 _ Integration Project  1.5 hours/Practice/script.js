// Data Structure
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const cancelEditBtn = document.getElementById('cancel-edit');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

// --- Core Functions ---

function loadTasks() {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(title, description, priority, dueDate) {
    const task = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.unshift(task); // Add to top
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function updateTask(id, title, description, priority, dueDate) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
        saveTasks();
        renderTasks();
        closeEditModal();
    }
}

function getFilteredTasks() {
    let filtered = tasks;

    // 1. Apply Tab Filter
    if (currentFilter === 'active') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    }

    // 2. Apply Search Filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

// --- UI Functions ---

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Clear current tasks
    taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    updateStats();
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`;
    div.dataset.id = task.id;

    const isChecked = task.completed ? 'checked' : '';
    const textStyle = task.completed ? 'line-through-gray' : 'text-gray-800';
    const descStyle = task.completed ? 'text-gray-400' : 'text-gray-600';
    const dateDisplay = task.dueDate ? `<span class="text-xs flex items-center gap-1 ${getDueDateColor(task.dueDate, task.completed)}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${new Date(task.dueDate).toLocaleDateString()}</span>` : '';

    div.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="pt-1">
                <input type="checkbox" class="w-5 h-5 cursor-pointer text-indigo-600 rounded focus:ring-indigo-500" 
                    ${isChecked} data-action="toggle">
            </div>
            
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold ${textStyle} break-words pr-2">${escapeHtml(task.title)}</h3>
                    <span class="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">${task.priority}</span>
                </div>
                <p class="text-sm mt-1 ${descStyle} break-words">${escapeHtml(task.description)}</p>
                <div class="flex items-center gap-4 mt-3">
                    ${dateDisplay}
                    <span class="text-xs text-gray-400">Added: ${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button class="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded" data-action="edit" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button class="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded" data-action="delete" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    `;
    
    // Add group class for hover effect on buttons
    div.classList.add('group');
    return div;
}

function updateStats() {
    statTotal.textContent = tasks.length;
    statCompleted.textContent = tasks.filter(t => t.completed).length;
    statPending.textContent = tasks.filter(t => !t.completed).length;
}

// --- Event Listeners ---

function setupEventListeners() {
    // Form Submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value.trim();
        const desc = document.getElementById('task-desc').value.trim();
        const priority = document.getElementById('task-priority').value;
        const date = document.getElementById('task-date').value;

        if (title) {
            addTask(title, desc, priority, date);
            taskForm.reset();
            // Reset date to today or empty? Empty is better.
        }
    });

    // Task List Actions (Delegation)
    taskList.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const card = target.closest('[data-id]');
        const id = parseInt(card.dataset.id);
        const action = target.dataset.action;

        if (action === 'delete') deleteTask(id);
        if (action === 'toggle') toggleTask(id);
        if (action === 'edit') openEditModal(id);
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('bg-indigo-100', 'text-indigo-700');
                b.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
            btn.classList.add('bg-indigo-100', 'text-indigo-700');

            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Search Input
    searchInput.addEventListener('input', renderTasks);

    // Edit Modal
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-id').value);
        const title = document.getElementById('edit-title').value.trim();
        const desc = document.getElementById('edit-desc').value.trim();
        const priority = document.getElementById('edit-priority').value;
        const date = document.getElementById('edit-date').value;

        if (title) updateTask(id, title, desc, priority, date);
    });

    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
}

// --- Helper Functions ---

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('edit-id').value = task.id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-desc').value = task.description;
    document.getElementById('edit-priority').value = task.priority;
    document.getElementById('edit-date').value = task.dueDate;

    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editModal.classList.add('hidden');
}

function getPriorityColor(priority) {
    switch(priority) {
        case 'high': return 'border-red-500';
        case 'medium': return 'border-yellow-500';
        case 'low': return 'border-green-500';
        default: return 'border-gray-200';
    }
}

function getDueDateColor(dateString, isCompleted) {
    if (isCompleted) return 'text-gray-400';
    const due = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (due < today) return 'text-red-600 font-bold'; // Overdue
    if (due.getTime() === today.getTime()) return 'text-orange-600 font-bold'; // Due today
    return 'text-gray-500';
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}