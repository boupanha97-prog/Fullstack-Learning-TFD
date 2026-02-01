const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearAllBtn = document.getElementById('clear-all');

// 1. Helper Functions for Local Storage
function getTodos() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 2. Core Logic Functions
function addTodo(text) {
    const todos = getTodos();
    const newTodo = {
        id: Date.now(), // Unique ID based on timestamp
        text: text,
        completed: false
    };
    
    todos.push(newTodo);
    saveTodos(todos);
    renderTodos();
}

function deleteTodo(id) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);
    saveTodos(todos);
    renderTodos();
}

function toggleTodo(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
        renderTodos();
    }
}

function renderTodos() {
    const todos = getTodos();
    todoList.innerHTML = ''; // Clear current list
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add('completed');
        }
        
        // Text span (clickable for toggle)
        const span = document.createElement('span');
        span.textContent = todo.text;
        span.style.cursor = 'pointer';
        span.style.flexGrow = '1';
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// 3. Event Listeners

// Load todos on startup
document.addEventListener('DOMContentLoaded', renderTodos);

// Add Todo
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

// Event Delegation for Delete and Toggle
todoList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    
    const id = parseInt(li.dataset.id);
    
    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
    } else {
        // Clicking anywhere else on the row toggles completion
        toggleTodo(id);
    }
});

// Clear All
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        localStorage.removeItem('todos');
        renderTodos();
    }
});