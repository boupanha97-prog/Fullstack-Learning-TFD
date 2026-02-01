const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearBtn = document.getElementById('clear-btn');

// Helper to update the counter
function updateCounter() {
    const count = todoList.children.length;
    todoCount.textContent = `Total: ${count}`;
}

// 1. Handle Form Submission
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    const text = todoInput.value.trim();
    if (text) {
        // Create li
        const li = document.createElement('li');
        
        // Create span for text (easier to style/edit than direct text node)
        const span = document.createElement('span');
        span.textContent = text;
        li.appendChild(span);
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        li.appendChild(deleteBtn);
        
        // Add to list
        todoList.appendChild(li);
        
        // Reset input
        todoInput.value = '';
        updateCounter();
    }
});

// 2. Event Delegation (Delete & Toggle Complete)
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('li');
    
    if (!li) return;

    // Handle Delete
    if (target.classList.contains('delete-btn')) {
        li.remove();
        updateCounter();
    } 
    // Handle Toggle Complete (if clicking the text/li, but not while editing)
    else if (!li.querySelector('input')) {
        li.classList.toggle('completed');
    }
});

// 3. Clear All Button
clearBtn.addEventListener('click', () => {
    if (todoList.children.length > 0 && confirm('Remove all items?')) {
        todoList.innerHTML = '';
        updateCounter();
    }
});

// 4. Bonus: Double-click to Edit
todoList.addEventListener('dblclick', (e) => {
    const target = e.target;
    const li = target.closest('li');
    
    // Check if we clicked the text span
    if (li && target.tagName === 'SPAN') {
        const span = target;
        const currentText = span.textContent;
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        
        // Replace span with input
        li.replaceChild(input, span);
        input.focus();
        
        // Save on blur or Enter key
        const save = () => {
            span.textContent = input.value.trim() || currentText; // Revert if empty
            if (li.contains(input)) li.replaceChild(span, input);
        };
        
        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => { if(e.key === 'Enter') save(); });
    }
});